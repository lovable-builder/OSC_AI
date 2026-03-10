# ETC Bridge - AI-Powered Lighting Control System

![ETC Bridge Logo](https://img.shields.io/badge/ETC%20Bridge-AI%20Lighting%20Control-blue)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3+-blue)

## 🎯 Overview

ETC Bridge is a cutting-edge lighting control interface that combines traditional ETC EOS console functionality with modern AI capabilities. This application provides intelligent voice control, automated fixture patching, and an intuitive user interface designed for lighting professionals and enthusiasts.

## 🚀 Key Features

### 🎙️ **Voice-Controlled Lighting**
- **Natural Voice Commands**: Control your lighting console using natural language
- **Real-time Voice Synthesis**: AI-powered responses with ElevenLabs integration
- **Hands-free Operation**: Navigate and control the entire console without touching a button
- **Voice Activity Detection**: Visual feedback showing when the system is listening and responding

### 🤖 **AI-Powered Fixture Patching**
- **Intelligent Suggestions**: AI analyzes your console and suggests optimal fixture configurations
- **Automated Parameter Mapping**: Smart detection and mapping of fixture parameters
- **Conflict Prevention**: Automatic detection and resolution of patching conflicts
- **Multi-fixture Support**: Batch operations for complex lighting setups

### 🧠 **Advanced Console Guide**
- **Interactive Tutorials**: Step-by-step voice-guided instructions for each console function
- **Contextual Help**: AI-powered assistance tailored to your current task
- **Progress Tracking**: Real-time feedback on console operations
- **Accessibility Features**: Full voice navigation for users with mobility limitations

### 🎨 **Modern User Interface**
- **Dark/Light Theme Support**: Professional themes with smooth transitions
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Glass Morphism Effects**: Modern visual design with depth and transparency
- **Animated Transitions**: Smooth animations and micro-interactions

### 🔌 **OSC Communication**
- **Real-time OSC Integration**: Seamless communication with ETC EOS consoles
- **Intelligent Command Parsing**: Advanced NLP for understanding complex lighting commands
- **Error Handling**: Robust error detection and user-friendly error messages
- **Multi-step Operations**: Support for complex, multi-command sequences

## 🛠️ Technical Architecture

### Frontend Technologies
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and build times
- **Tailwind CSS** for modern, utility-first styling
- **ShadCN UI** for accessible, beautiful components
- **Lucide Icons** for consistent iconography

### AI & Voice Technologies
- **ElevenLabs API** for high-quality voice synthesis
- **OpenAI GPT** integration for natural language processing
- **Web Speech API** for voice recognition
- **WebSocket Communication** for real-time updates

### Backend Services
- **Supabase Functions** for serverless AI processing
- **OSC Protocol** for console communication
- **Real-time Database** for state management
- **Authentication** with role-based access control

## 📋 System Requirements

### Hardware Requirements
- **Computer**: Modern CPU (2GHz+ recommended)
- **Memory**: 4GB RAM minimum, 8GB recommended
- **Network**: Stable internet connection for AI services
- **Audio**: Microphone and speakers for voice features

### Software Requirements
- **Node.js**: Version 18 or higher
- **Web Browser**: Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+
- **ETC EOS Console**: Any EOS family console with OSC support

## 🚀 Quick Start

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/your-core-giver.git
   cd your-core-giver
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key
   VITE_OPENAI_API_KEY=your_openai_api_key
   VITE_EOS_HOST=localhost
   VITE_EOS_PORT=3032
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:8082`

### Basic Usage

1. **Connect to your EOS Console:**
   - Ensure your console is connected to the same network
   - Configure OSC settings in your console
   - The application will automatically detect and connect

2. **Enable Voice Control:**
   - Click the voice button in the console interface
   - Grant microphone permissions when prompted
   - Start speaking commands like "Turn on lights" or "Patch fixtures"

3. **Use the Console Guide:**
   - Navigate to the Console Guide section
   - Select a step to begin
   - Follow the voice-guided instructions

4. **Automated Fixture Patching:**
   - Go to the Patching Assistant
   - Select your fixture type
   - Let the AI suggest optimal patching configurations

## 🎙️ Voice Commands

### Basic Lighting Control
- "Turn on all lights"
- "Turn off channel 1"
- "Set intensity to 50%"
- "Go to cue 5"
- "Record a new cue"

### Console Navigation
- "Open patching"
- "Show console guide"
- "Go to next step"
- "Repeat that instruction"
- "Help with this step"

### Advanced Operations
- "Patch 10 LED fixtures"
- "Set color to blue"
- "Create a chase sequence"
- "Save current setup"
- "Load preset 3"

## 🔧 Configuration

### Theme Customization
Switch between dark and light themes using the theme toggle in the header. Themes are automatically saved to local storage.

### Voice Settings
- **Voice Speed**: Adjust the speaking rate of AI responses
- **Voice Volume**: Control the volume of voice feedback
- **Voice Type**: Choose between different AI voice options

### OSC Configuration
- **Host**: IP address of your EOS console
- **Port**: OSC communication port (default: 3032)
- **Timeout**: Connection timeout settings
- **Retry Attempts**: Number of reconnection attempts

## 📚 API Documentation

### VoiceAgent Component
```typescript
interface VoiceAgentProps {
  onVoiceCommand: (command: string) => void;
  onVoiceResponse: (response: string) => void;
  isActive: boolean;
}

// Usage
<VoiceAgent 
  onVoiceCommand={handleCommand}
  onVoiceResponse={handleResponse}
  isActive={isVoiceActive}
/>
```

### OSC Agent Function
```typescript
interface OSCCommand {
  action: string;
  parameters: Record<string, any>;
  context?: string;
}

// Example usage
const command: OSCCommand = {
  action: "patch",
  parameters: {
    fixtureType: "LED",
    channel: 1,
    address: 101
  }
};
```

### Patching Assistant
```typescript
interface PatchingRequest {
  fixtureType: string;
  quantity: number;
  startingChannel: number;
  parameters?: string[];
}

// Example usage
const patchingRequest: PatchingRequest = {
  fixtureType: "Moving Head",
  quantity: 4,
  startingChannel: 101,
  parameters: ["Pan", "Tilt", "Color"]
};
```

## 🔒 Security

- **API Key Management**: Secure storage and transmission of API keys
- **Input Validation**: Comprehensive validation of all user inputs
- **Error Handling**: Graceful handling of network and API errors
- **Data Privacy**: No sensitive data is stored or transmitted

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests: `npm test`
5. Commit your changes: `git commit -m 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## 🐛 Bug Reports

To report a bug or request a feature, please use the [GitHub Issues](https://github.com/your-org/your-core-giver/issues) page.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **ETC (Electronic Theatre Controls)** for their excellent EOS console platform
- **ElevenLabs** for their outstanding voice synthesis technology
- **OpenAI** for their powerful language models
- **The React and Tailwind CSS communities** for their amazing tools

## 📞 Support

For support and questions:
- **Documentation**: [Wiki](https://github.com/your-org/your-core-giver/wiki)
- **Community**: [Discussions](https://github.com/your-org/your-core-giver/discussions)
- **Email**: support@yourdomain.com

---

**ETC Bridge** - Where traditional lighting control meets modern AI technology. 🎨🤖💡