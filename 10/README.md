# Product Search Tool

A console-based application that uses OpenAI's function calling to filter products based on natural language queries.

## Features
- Natural language product search
- Filtering by category, price, rating, and stock status
- OpenAI GPT-4 powered understanding of user queries
- Clean console interface

## Prerequisites
- Python 3.6+
- OpenAI API key

## Installation

1. Clone the repository
2. Install dependencies:
```bash
pip install openai python-dotenv
```

3. Create a `.env` file in the project root with your OpenAI API key:
```bash
OPENAI_API_KEY=your_api_key_here
```

## Running the Application

1. Make sure you're in the project directory
2. Run the application:
```bash
python3 product_search.py
```

3. Enter your search queries in natural language. Examples:
- "Show me kitchen items under $100"
- "I need out of stock kitchen appliances"
- "Find electronics with rating above 4.5"

4. Type 'quit' to exit the application

## Sample Outputs

See [sample_outputs.md](sample_outputs.md) for example runs of the application.

## Project Structure
- `product_search.py` - Main application code
- `products.json` - Product database
- `.env` - Environment variables (not included in repo)
- `sample_outputs.md` - Example runs
- `README.md` - This file 