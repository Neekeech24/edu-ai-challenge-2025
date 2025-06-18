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
    """Define the OpenAI function for product filtering."""
    return {
        "name": "filter_products",
        "description": "Filter products based on user preferences",
        "parameters": {
            "type": "object",
            "properties": {
                "category": {
                    "type": "string",
                    "enum": ["Electronics", "Fitness", "Kitchen", "Books", "Clothing"],
                    "description": "Product category"
                },
                "min_price": {
                    "type": "number",
                    "description": "Minimum price (for 'over X' queries)"
                },
                "max_price": {
                    "type": "number",
                    "description": "Maximum price (for 'under X' queries)"
                },
                "min_rating": {
                    "type": "number",
                    "description": "Minimum rating (1-5)"
                },
                "show_in_stock": {
                    "type": "boolean",
                    "description": "True to show only in-stock items, False to show only out-of-stock items"
                }
            }
        }
    }

def filter_products(products, filters):
    """Filter products based on the criteria."""
    filtered = products.copy()
    
    if 'category' in filters:
        filtered = [p for p in filtered if p['category'] == filters['category']]
    
    if 'min_price' in filters:
        filtered = [p for p in filtered if p['price'] > filters['min_price']]
        
    if 'max_price' in filters:
        filtered = [p for p in filtered if p['price'] < filters['max_price']]
    
    if 'min_rating' in filters:
        filtered = [p for p in filtered if p['rating'] >= filters['min_rating']]
    
    if 'show_in_stock' in filters:
        filtered = [p for p in filtered if p['in_stock'] == filters['show_in_stock']]
    
    return filtered

def format_product(product):
    """Format a product for display."""
    return f"{product['name']} - ${product['price']:.2f}, Rating: {product['rating']}, {'In Stock' if product['in_stock'] else 'Out of Stock'}"

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
            # Call OpenAI API to process the natural language query
            response = client.chat.completions.create(
                model="gpt-4.1-mini",
                messages=[
                    {"role": "system", "content": "You are a helpful shopping assistant that helps filter products based on user preferences."},
                    {"role": "user", "content": user_input}
                ],
                tools=[{
                    "type": "function",
                    "function": get_openai_function()
                }],
                tool_choice={"type": "function", "function": {"name": "filter_products"}},
                temperature=0.7,
                max_tokens=2000
            )

            # Extract the function arguments
            function_args = json.loads(response.choices[0].message.tool_calls[0].function.arguments)
            
            # Filter products
            filtered_products = filter_products(products, function_args)

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