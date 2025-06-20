# Audio Transcription, Summarization, and Analysis Tool

This console application transcribes a given audio file, provides a summary of the transcription, and extracts key analytics.

## Features

- Transcribes audio files using OpenAI's Whisper API.
- Summarizes the transcription using OpenAI's GPT-4 model.
- Analyzes the transcription to provide:
  - Total word count.
  - Speaking speed in words per minute (WPM).
  - Frequently mentioned topics.
- Saves the transcription, summary, and analysis to separate files.

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-link>
    cd <your-repo-directory>/11
    ```

2.  **Install dependencies:**
    Make sure you have Python 3.6+ installed.
    ```bash
    pip install -r requirements.txt
    ```

3.  **Set up your environment variables:**
    Create a `.env` file in the `11` directory and add your OpenAI API key:
    ```
    OPENAI_API_KEY=your_openai_api_key
    ```

## Usage

To run the application, execute the `main.py` script from your terminal, providing the path to the audio file you want to process as an argument.

```bash
python main.py /path/to/your/audio_file.mp3
```

### Example

```bash
python main.py CAR0004.mp3
```

The application will print the summary and analysis to the console and create the following files in the same directory:

-   `CAR0004_transcription.txt`: The full transcription of the audio.
-   `CAR0004_summary.md`: The summarized version of the transcription.
-   `CAR0004_analysis.json`: The extracted analytics in JSON format. 