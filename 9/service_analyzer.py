import os
import sys
from openai import OpenAI
from dotenv import load_dotenv
import textwrap
import json
import datetime
import time
from threading import Event
import threading

# Load environment variables
load_dotenv()

# Configure OpenAI client
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

def show_progress(stop_event):
    """Show a simple progress indicator while waiting for the API response"""
    progress = ['|', '/', '-', '\\']
    i = 0
    while not stop_event.is_set():
        sys.stdout.write('\rGenerating report... ' + progress[i % len(progress)])
        sys.stdout.flush()
        time.sleep(0.2)
        i += 1
    sys.stdout.write('\r' + ' ' * 30 + '\r')  # Clear the progress indicator
    sys.stdout.flush()

def generate_report(input_text, is_service_name=False):
    # Prepare the system message and user prompt
    system_message = """You are a comprehensive service analyzer that provides detailed reports about digital services. 
    Your analysis should be thorough, professional, and well-structured."""
    
    service_name = input_text if is_service_name else "Custom Service"
    
    if is_service_name:
        user_prompt = f"Provide a comprehensive analysis of the service '{input_text}'. Include all required sections."
    else:
        user_prompt = f"Analyze the following service description and provide a comprehensive report:\n\n{input_text}"

    # Add the required sections to the prompt
    user_prompt += f"""\n\nPlease structure your response in markdown format with the following sections:
    
    # Service Analysis Report: {service_name}
    
    ## Brief History
    [Founding year, key milestones]
    
    ## Target Audience
    [Primary user segments]
    
    ## Core Features
    [Top 2-4 key functionalities]
    
    ## Unique Selling Points
    [Key differentiators]
    
    ## Business Model
    [Revenue generation approach]
    
    ## Tech Stack Insights
    [Technologies used]
    
    ## Perceived Strengths
    [Standout features and positives]
    
    ## Perceived Weaknesses
    [Drawbacks and limitations]
    """

    try:
        # Start progress indicator
        stop_event = Event()
        progress_thread = threading.Thread(target=show_progress, args=(stop_event,))
        progress_thread.start()

        try:
            # Make API call to OpenAI with timeout
            response = client.chat.completions.create(
                model="gpt-4.1-mini",
                messages=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.7,
                max_tokens=2000,
                timeout=60  # 60 seconds timeout
            )
            
            report = response.choices[0].message.content
            
            # Add a clear header with service name and timestamp
            header = f"""# Service Analysis Report: {service_name}
Generated on: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

---

"""
            return header + report

        except Exception as e:
            if "timeout" in str(e).lower():
                return "Error: The request timed out. Please try again."
            else:
                return f"Error generating report: {str(e)}"
        finally:
            # Stop progress indicator
            stop_event.set()
            progress_thread.join()

    except Exception as e:
        return f"Error generating report: {str(e)}"

def main():
    print("\nService Analyzer - Comprehensive Report Generator")
    print("=" * 50)
    
    while True:
        print("\nChoose input type:")
        print("1. Service Name (e.g., 'Spotify', 'Notion')")
        print("2. Service Description Text")
        print("3. Exit")
        
        choice = input("\nEnter your choice (1-3): ")
        
        if choice == "3":
            print("\nThank you for using Service Analyzer!")
            sys.exit(0)
            
        if choice not in ["1", "2"]:
            print("\nInvalid choice. Please try again.")
            continue
            
        is_service_name = (choice == "1")
        prompt = "Enter service name: " if is_service_name else "Enter service description (press Enter twice to finish):\n"
        
        if is_service_name:
            input_text = input(prompt)
        else:
            print(prompt)
            lines = []
            while True:
                line = input()
                if line == "":
                    break
                lines.append(line)
            input_text = "\n".join(lines)
        
        if not input_text.strip():
            print("\nInput cannot be empty. Please try again.")
            continue
            
        print("\nStarting analysis...")
        report = generate_report(input_text, is_service_name)
        
        # Print the report
        print("\nGenerated Report:")
        print("=" * 50)
        print(report)
        print("=" * 50)
        
        # Ask if user wants to save the report
        save = input("\nWould you like to save this report to a file? (y/n): ")
        if save.lower() == 'y':
            filename = input("Enter filename (default: report.md): ").strip() or "report.md"
            if not filename.endswith('.md'):
                filename += '.md'
            
            # Check if file exists and append if it does
            mode = 'a' if os.path.exists(filename) else 'w'
            with open(filename, mode) as f:
                # If file exists and has content, add a separator
                if mode == 'a':
                    f.write("\n\n---\n\n")  # Add markdown separator between reports
                f.write(report)
            print(f"\nReport {'appended to' if mode == 'a' else 'saved to'} {filename}")

if __name__ == "__main__":
    if not os.getenv('OPENAI_API_KEY'):
        print("Error: OPENAI_API_KEY not found in environment variables.")
        print("Please create a .env file with your OpenAI API key.")
        sys.exit(1)
    main() 