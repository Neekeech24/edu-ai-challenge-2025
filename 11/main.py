import openai
import os
import argparse
import json
from dotenv import load_dotenv
from pydub import AudioSegment

def get_audio_duration(file_path):
    """Calculates the duration of an audio file in minutes."""
    try:
        audio = AudioSegment.from_file(file_path)
        duration_minutes = len(audio) / (1000 * 60)
        return duration_minutes
    except Exception as e:
        print(f"Error getting audio duration: {e}")
        return None

def transcribe_audio(file_path):
    """Transcribes an audio file using OpenAI's Whisper API."""
    if not os.path.exists(file_path):
        return "Error: Audio file not found."

    try:
        with open(file_path, "rb") as audio_file:
            transcript = openai.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
                response_format="text"
            )
        return transcript
    except Exception as e:
        return f"Error during transcription: {e}"

def summarize_text(text):
    """Summarizes the given text using OpenAI's GPT model."""
    try:
        response = openai.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that summarizes text."},
                {"role": "user", "content": f"Please summarize the following text:\n\n{text}"}
            ]
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"Error during summarization: {e}"

def analyze_text(text, duration_minutes):
    """Analyzes the text to extract word count, speaking speed, and frequent topics."""
    word_count = len(text.split())
    speaking_speed_wpm = int(word_count / duration_minutes) if duration_minutes else 0

    try:
        response = openai.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[
                {"role": "system", "content": "You are an AI assistant that analyzes text. Extract the top 3-5 most frequently mentioned topics from the text and return them as a JSON array of objects, where each object has a 'topic' and 'mentions' key. For example: [{\"topic\": \"Customer Onboarding\", \"mentions\": 6}]"},
                {"role": "user", "content": f"Analyze the following text and identify the key topics and their frequencies:\n\n{text}"}
            ]
        )
        topics = json.loads(response.choices[0].message.content.strip())
    except Exception as e:
        print(f"Error parsing topics from AI response: {e}")
        topics = []

    analysis = {
        "word_count": word_count,
        "speaking_speed_wpm": speaking_speed_wpm,
        "frequently_mentioned_topics": topics
    }
    return analysis

def main():
    """Main function to process the audio file."""
    parser = argparse.ArgumentParser(description="Transcribe, summarize, and analyze an audio file.")
    parser.add_argument("audio_file", help="Path to the audio file to process.")
    args = parser.parse_args()

    load_dotenv()
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("Error: OPENAI_API_KEY not found in .env file.")
        return

    openai.api_key = api_key

    # Transcription
    print("Transcribing audio...")
    transcription = transcribe_audio(args.audio_file)
    if "Error" in transcription:
        print(transcription)
        return

    # Determine output paths based on the input file
    output_dir = os.path.dirname(args.audio_file)
    if not output_dir:
        output_dir = "."
    base_filename = os.path.splitext(os.path.basename(args.audio_file))[0]
    
    # Save transcription to a file
    transcription_filename = os.path.join(output_dir, f"{base_filename}_transcription.md")
    with open(transcription_filename, "w") as f:
        f.write(transcription)
    print(f"\nTranscription saved to {transcription_filename}")

    # Summarization
    print("\nSummarizing transcription...")
    summary = summarize_text(transcription)
    if "Error" in summary:
        print(summary)
    else:
        summary_filename = os.path.join(output_dir, f"{base_filename}_summary.md")
        with open(summary_filename, "w") as f:
            f.write(summary)
        print(f"Summary saved to {summary_filename}")
        print("\nSummary:")
        print(summary)

    # Analysis
    print("\nAnalyzing transcription...")
    duration = get_audio_duration(args.audio_file)
    if duration is not None:
        analysis = analyze_text(transcription, duration)
        analysis_filename = os.path.join(output_dir, f"{base_filename}_analysis.json")
        with open(analysis_filename, "w") as f:
            json.dump(analysis, f, indent=2)
        print(f"Analysis saved to {analysis_filename}")

        print("\nAnalysis:")
        print(json.dumps(analysis, indent=2))
    else:
        print("Could not calculate analysis due to an error in getting audio duration.")

if __name__ == "__main__":
    main() 