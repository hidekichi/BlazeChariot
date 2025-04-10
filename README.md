# Eleventy Web Starter

An opinionated starter template for building static websites using [Eleventy](https://www.11ty.dev/). This starter kit is designed to help you quickly set up a modern, fast, and efficient static site with best practices for templating, styling, and performance optimisation.

## ✨ Features

- **Eleventy (11ty)** for static site generation
- **Nunjucks** templating language and **Markdown** support
- **SCSS** for modular and maintainable styling
- **ESBuild** for fast and efficient bundling of JavaScript
- **Image Optimisation** using Eleventy plugins
- **Live Reload** for rapid development
- **SEO Optimizations** and social sharing metadata
- Pre-configured for easy **deployment to Netlify**, **Vercel**, or **GitHub Pages**

## 🛠️ Tech Stack

- **Static Site Generator**: [Eleventy (11ty)](https://www.11ty.dev/)
- **Templating Languages**: Nunjucks, Liquid, Markdown
- **Styling**: SCSS, PostCSS
- **JavaScript**: ES6 Modules
- **Build Tool**: ESBuild
- **Deployment**: Netlify, Vercel, GitHub Pages

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v14+)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)

### Installation

1. **Clone the Repository:**
   
   ```bash
   git clone https://github.com/chrissy-dev/eleventy-web-starter.git
   cd eleventy-web-starter
   ```

2. **Install Dependencies:**
   
   ```bash
   npm install
   ```
   
   Or, if using Yarn:
   
   ```bash
   yarn install
   ```

### Running the Project

Start the local development server:

```bash
npm run dev
```

This command will:

- Build the project using Eleventy
- Watch for changes in source files
- Serve the project at `http://localhost:8080`
- Enable live reload for a smooth development experience

### Building for Production

To generate a production-ready build, run:

```bash
npm run build
```

The output will be in the `dist` folder, optimised and ready for deployment.

## 📂 Project Structure

Here's an overview of the core structure of this project:

```plaintext
eleventy-web-starter/
├── src/                 # Source files for the project
│   ├── _data/           # Data files in JSON or JS format
│   ├── _includes/       # Reusable components
│   ├── _layouts/        # Reusable layouts
│   ├── _assets/         # Assets - JS, CSS (Tailwind)
├── .eleventy.js         # Eleventy configuration file
├── package.json         # Node dependencies and scripts
├── tailwind.config.js   # Tailwind Config
├── postcss.config.js    # PostCSS Config
└── README.md            # Project documentation
```

## 📜 Available Scripts

- **`npm start`**: Start the development server with live reload.
- **`npm run build`**: Create a production build of the site.
- **`npm run clean`**: Remove the `dist` folder to reset the build.

## 🌐 Deployment

This starter is optimised for deployment on popular static site hosts. Follow the instructions below for different providers:

### Netlify

1. Click the button below to deploy to Netlify:
   
   [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/chrissy-dev/eleventy-web-starter)

2. Configure the build settings:
   
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`

### Vercel

1. Install the [Vercel CLI](https://vercel.com/docs/cli) if not already installed:
   
   ```bash
   npm install -g vercel
   ```

2. Deploy using the Vercel CLI:
   
   ```bash
   vercel
   ```

3. Follow the prompts to complete the deployment.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/chrissy-dev/eleventy-web-starter/issues).

To contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Commit your changes (`git commit -m 'Add a new feature'`)
4. Push to the branch (`git push origin feature-branch`)
5. Open a Pull Request

## 📝 License

This project is [MIT](LICENSE) licensed.

## 📧 Contact

If you have any questions or need further assistance, feel free to reach out:

- **GitHub**: [chrissy-dev](https://github.com/chrissy-dev)