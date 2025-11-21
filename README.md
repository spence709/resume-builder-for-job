# ATS Resume Builder

Optimize your resume for any job description using AI to match job requirements and pass ATS systems.

## Features

- 🤖 AI-powered resume optimization
- 📊 ATS compatibility scoring
- 📝 Uses default resume template (no manual input needed)
- 🚀 Fast and efficient

## Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

Get your OpenAI API key from [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)

### 3. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Enter the **Job Title** you're applying for
2. Paste the complete **Job Description**
3. The app automatically loads your resume from `resumes/software-engineer.md`
4. Click **Optimize Resume** to get an AI-optimized version

## Customizing Your Resume

Edit the file `resumes/software-engineer.md` with your actual resume content. The app will automatically use this file.

## Deployment

### Vercel

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add the `OPENAI_API_KEY` environment variable in Vercel project settings
4. Deploy!

## Tech Stack

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **OpenAI API** - AI-powered optimization
- **Tailwind CSS** - Styling

## License

MIT

