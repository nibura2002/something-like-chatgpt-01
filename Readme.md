# Something like ChatGPT (For Web app study)
Simple flask based Assistant Chat Bot App for study.

## How to install
Run bellow comand to install python and packages. Need pyenv and poetry to install. Also, Need OpenAI API key to use.
- pyenv install $(cat .python-version)
- poetry install

## How to use
- Add .env to the route directory and add "OPENAI_API_KEY={YOUR_OPENAI_API_KEY}" to .env.  
- Change running port with directly change 'app.run(debug=True, port=8000)' to 'app.run(debug=True, port={YOUR_PORT})' in app.py.  
- run 'poetry run python app.py'  
- see http://localhost:{YOUR_PORT} with your web browser