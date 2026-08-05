import type { ResearchArea } from './types';

export const researchAreas: ResearchArea[] = [
  {
    id: 'generative-3d-vision',
    name: 'Generative 3D Vision and Graphics',
    shortDescription:
      'We develop generative models for creating, reconstructing, and controlling three-dimensional faces, human motion, objects, and scenes.',
    extendedDescription:
      'Our research in generative 3D vision and graphics investigates computational methods for modelling complex visual structures and dynamic environments. Current topics include neural representations, 3D head avatars, controllable human motion generation, scene generation, reconstruction, rendering, and related applications in computer graphics and computer vision.',
    topics: [
      '3D face and head-avatar generation',
      'Human motion generation',
      '3D scene generation',
      'Neural rendering',
      '3D Gaussian representations',
      'Controllable generative models',
      'Visual reconstruction',
    ],
    accent: 'mist',
    visual: 'surface',
  },
  {
    id: 'multimodal-perception',
    name: 'Multimodal Perception and Intelligent Sensing',
    shortDescription:
      'We design learning-based systems that integrate images, video, audio, remote-sensing data, and other sensor signals to understand real-world environments.',
    extendedDescription:
      'Our research in multimodal perception and intelligent sensing develops deep-learning methods for extracting meaningful information from heterogeneous data sources. We study the joint understanding of visual, acoustic, spatial, and sensor observations, with applications including remote-sensing image analysis, environmental monitoring, anomaly detection, gas-leak detection, audio processing, and intelligent surveillance.',
    topics: [
      'Remote-sensing image analysis',
      'Image and video understanding',
      'Audio and acoustic signal analysis',
      'Gas-leak detection',
      'Environmental monitoring',
      'Multisensor data fusion',
      'Anomaly and event detection',
      'Intelligent surveillance',
    ],
    accent: 'sage',
    visual: 'signal',
  },
  {
    id: 'trustworthy-ai',
    name: 'Trustworthy and Explainable AI',
    shortDescription:
      'We investigate artificial-intelligence systems that are interpretable, reliable, robust, and safe for use in complex real-world settings.',
    extendedDescription:
      'Our research in trustworthy and explainable AI examines how learning-based systems make decisions, how their behaviour can be interpreted, and how their reliability can be improved. We are interested in explainability, robustness, uncertainty, safety, fairness, and responsible deployment across vision, sensing, and multimodal applications.',
    topics: [
      'Explainable AI',
      'Interpretable machine learning',
      'AI safety',
      'Model robustness',
      'Reliability and uncertainty',
      'Responsible AI',
      'Bias and fairness',
      'Evaluation of high-stakes AI systems',
    ],
    accent: 'sand',
    visual: 'trust',
  },
];
