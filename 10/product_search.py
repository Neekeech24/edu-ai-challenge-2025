import json
import os
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def load_products(file_path):
    """Load products from JSON file."""
    with open(file_path, 'r') as f:
        return json.load(f)

def get_openai_function():
    """Define the OpenAI function for displaying filtered products."""
    return {
        "name": "display_filtered_products",
        "description": "Displays a list of products to the user that match their filtering criteria from a provided list.",
        "parameters": {
            "type": "object",
            "properties": {
                "filtered_products": {
                    "type": "array",
                    "description": "The list of products that match the user's query.",
                    "items": {
                        "type": "object",
                        "properties": {
                            "id": {"type": "number"},
                            "name": {"type": "string"},
                            "category": {"type": "string"},
                            "price": {"type": "number"},
                            "rating": {"type": "number"},
                            "in_stock": {"type": "boolean"}
                        },
                        "required": ["id", "name", "category", "price", "rating", "in_stock"]
                    }
                }
            },
            "required": ["filtered_products"]
        }
    }

def format_product(product):
    """Format a product for display."""
    return f"{product.get('name', 'N/A')} - ${product.get('price', 0):.2f}, Rating: {product.get('rating', 'N/A')}, {'In Stock' if product.get('in_stock', False) else 'Out of Stock'}"

def main():
    # Check for OpenAI API key
    api_key = os.getenv('OPENAI_API_KEY')
    if not api_key:
        print("Error: OPENAI_API_KEY not found in environment variables.")
        print("Please set your OpenAI API key in a .env file or environment variables.")
        return

    # Initialize OpenAI client
    client = OpenAI()

    # Load products
    try:
        products = load_products('products.json')
    except FileNotFoundError:
        print("Error: products.json not found.")
        return
    except json.JSONDecodeError:
        print("Error: Invalid JSON in products.json")
        return

    print("Welcome to the Product Search Tool!")
    print("Enter your search preferences in natural language.")
    print("Example: 'I need a smartphone under $800 with a great camera and long battery life'")
    print("Type 'quit' to exit.")
    print("\n")

    while True:
        # Get user input
        user_input = input("What are you looking for? ").strip()
        
        if user_input.lower() == 'quit':
            break

        try:
            products_json_string = json.dumps(products)
            system_message = (
                "You are a helpful shopping assistant. Your task is to filter a list of products based on the user's preferences. "
                "You will be given a JSON object containing a list of all available products in the user message. "
                "You must analyze the user's query, filter the provided product list, and then use the 'display_filtered_products' function "
                "to return ONLY the products that exactly match the user's criteria. "
                "The 'filtered_products' parameter of the function must be a list of product objects from the original list. "
                "Do not invent products or modify them. Only return a subset of the original list."
            )
            
            user_message = f"Please filter the following products based on my request.\n\nProduct List:\n{products_json_string}\n\nUser Request: '{user_input}'"

            # Call OpenAI API to process the natural language query
            response = client.chat.completions.create(
                model="gpt-4.1-mini",
                messages=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": user_message}
                ],
                tools=[{
                    "type": "function",
                    "function": get_openai_function()
                }],
                tool_choice={"type": "function", "function": {"name": "display_filtered_products"}},
                temperature=0.1,
            )

            # Extract the function arguments
            tool_call = response.choices[0].message.tool_calls[0]
            if tool_call.function.name == "display_filtered_products":
                function_args = json.loads(tool_call.function.arguments)
                filtered_products = function_args.get("filtered_products", [])
            else:
                filtered_products = []
            
            # Display results
            print("\nFiltered Products:")
            if filtered_products:
                for i, product in enumerate(filtered_products, 1):
                    print(f"{i}. {format_product(product)}")
            else:
                print("No products found matching your criteria.")
            print("\n")

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            print("Please try again with a different query.")

if __name__ == "__main__":
    main() 