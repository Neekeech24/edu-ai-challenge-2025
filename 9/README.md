# Service Analyzer

A console application that generates comprehensive, markdown-formatted reports about digital services using AI analysis.

## Features

- Accept service names or descriptions as input
- Generate detailed analysis reports with multiple perspectives
- Output formatted reports to console or save to file
- Secure API key handling through environment variables

## Requirements

- Python 3.7+
- OpenAI API key
- Required Python packages (see requirements.txt)

## Installation

1. Clone the repository
2. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install required packages:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file in the project directory:
   ```bash
   cp .env.example .env
   ```
5. Add your OpenAI API key to the `.env` file:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

## Usage

1. Run the application:
   ```bash
   python service_analyzer.py
   ```

2. Choose input type:
   - Option 1: Enter a known service name (e.g., "Spotify", "Notion")
   - Option 2: Enter a service description text

3. View the generated report in the console

4. Optionally save the report to a markdown file

## Report Sections

The generated reports include:
- Brief History
- Target Audience
- Core Features
- Unique Selling Points
- Business Model
- Tech Stack Insights
- Perceived Strengths
- Perceived Weaknesses

## Security Note

Never commit your `.env` file containing the API key to version control. The `.env` file is included in `.gitignore` by default. 