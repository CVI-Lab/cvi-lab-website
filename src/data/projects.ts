import type { Project } from './types';

export const projects: Project[] = [
  {
    slug: 'aesthetic-alignment',
    title: 'Universal Aesthetic Alignment',
    subtitle: 'Why a Single Notion of Beauty Narrows Artistic Expression',
    summary:
      'A position paper and benchmark study showing how image generators and reward models can override requests for unconventional, abstract, or deliberately anti-aesthetic imagery.',
    overviewImage: 'https://weathon.github.io/icml2026_position/site/img/local/demo.jpg',
    imageAlt:
      'Examples of deliberately unconventional generated scenes used to study aesthetic alignment',
    visualCaption:
      'Wide-spectrum aesthetic examples from the official project page.',
    venue: 'ICML',
    venueLong: 'International Conference on Machine Learning, Position Track Spotlight',
    year: 2026,
    projectUrl: 'https://weathon.github.io/icml2026_position/',
    paperUrl: 'https://openreview.net/forum?id=1gQ4zc1Q8I',
    tags: ['Generative AI', 'AI Alignment', 'Aesthetic Diversity'],
    featured: false,
    publicationId: 'guo-2026-aesthetic-alignment',
    authors: ['Wenqi Marshall Guo', 'Qingyun Qian', 'Khalad Hasan', 'Shan Du'],
    affiliations: ['The University of British Columbia', 'Weathon Software'],
    overview: [
      'Image-generation systems are commonly optimized toward a broad, average notion of visual appeal. This paper argues that the same preference can conflict with user intent when a request deliberately calls for abstraction, discomfort, visual roughness, or other non-mainstream aesthetics.',
      'The authors call this reversed alignment: instead of adapting to the user’s stated aesthetic goal, the system steers the output back toward the developer’s preferred visual norm.',
    ],
    contributions: [
      'Frames universal aesthetic optimization as an alignment and user-autonomy problem rather than only an image-quality concern.',
      'Builds a wide-spectrum aesthetics benchmark for testing whether generators follow unconventional visual instructions.',
      'Studies generation, image-to-image editing, reward-model scoring, and the treatment of recognized abstract artworks.',
    ],
    method:
      'The study expands ordinary image descriptions with controlled wide-spectrum aesthetic attributes, compares generated outputs against those requests, and evaluates how aesthetic reward models score prompt-following but conventionally unattractive images. It also tests image editing and real artworks to separate prompt adherence from generic beauty preference.',
    results:
      'Across the evaluated generators and reward models, the study finds a recurring preference for conventionally polished imagery. Systems often beautify or sanitize deliberately unconventional requests, while reward models can penalize outputs that follow those requests more faithfully.',
  },
  {
    slug: 'vsf',
    title: 'VSF',
    subtitle: 'Value Sign Flip for Negative Guidance in Few-Step Generative Models',
    summary:
      'A lightweight negative-prompt guidance method that suppresses unwanted concepts by flipping attention value vectors, without retraining the generation model.',
    overviewImage:
      'https://github.com/user-attachments/assets/751e06db-bbd3-4c1b-b208-c384100efeea',
    imageAlt:
      'VSF examples comparing generated images before and after removing concepts named in negative prompts',
    visualCaption: 'Negative-prompt guidance examples from the official VSF repository.',
    venue: 'ICLR',
    venueLong: 'International Conference on Learning Representations',
    year: 2026,
    projectUrl: 'https://vsf.weasoft.com/',
    paperUrl: 'https://openreview.net/forum?id=W2NINfoVtN',
    codeUrl: 'https://github.com/weathon/VSF',
    tags: ['Diffusion Models', 'Negative Guidance', 'Image Generation'],
    featured: false,
    publicationId: 'guo-2026-vsf',
    authors: ['Wenqi Guo', 'Shan Du'],
    affiliations: ['The University of British Columbia', 'Weathon Software'],
    overview: [
      'Few-step image and video generators are fast, but conventional classifier-free guidance is often ineffective at removing concepts named in a negative prompt. Existing alternatives can also require retraining or add substantial inference cost.',
      'VSF introduces negative guidance directly inside attention, making it compatible with modern few-step diffusion and flow-matching architectures while keeping the implementation compact.',
    ],
    contributions: [
      'Introduces value sign flipping as a training-free mechanism for suppressing negative-prompt concepts.',
      'Uses attention masking and token handling to localize negative guidance and reduce unintended changes.',
      'Evaluates the method on few-step image and video generation and releases code, a demo, and a ComfyUI integration.',
    ],
    method:
      'VSF encodes positive and negative prompts together, identifies attention values associated with the negative tokens, and reverses their sign before the attention output is aggregated. A scale parameter controls suppression strength, while masks constrain where and how strongly negative guidance is applied.',
    results:
      'Experiments on the NegGenBench prompt pairs report stronger negative-prompt adherence than the compared few-step guidance methods while retaining competitive image quality and positive-prompt fidelity. The method is demonstrated with Stable Diffusion 3.5 Turbo, Flux Schnell, and Wan image/video models.',
  },
  {
    slug: 'architecthead',
    title: 'ArchitectHead',
    subtitle: 'Continuous Level of Detail Control for 3D Gaussian Head Avatars',
    summary:
      'A 3D Gaussian head-avatar framework with continuous level-of-detail control, balancing visual quality against rendering cost without retraining.',
    overviewImage: 'https://yan.auroratns.com/docs/architect/teaser.png',
    imageAlt: 'ArchitectHead teaser comparing head-avatar renderings across levels of detail',
    visualCaption:
      'ArchitectHead renderings across continuously adjustable levels of detail. Image from the official project page.',
    venue: 'WACV',
    venueLong: 'IEEE/CVF Winter Conference on Applications of Computer Vision',
    year: 2026,
    projectUrl: 'https://yan.auroratns.com/docs/architect/index.html',
    paperUrl:
      'https://openaccess.thecvf.com/content/WACV2026/papers/Yan_ArchitectHead_Continuous_Level_of_Detail_Control_for_3D_Gaussian_Head_WACV_2026_paper.pdf',
    codeUrl: 'https://github.com/PeizhiYan/ArchitectHead',
    tags: ['3D Vision', 'Gaussian Splatting', 'Head Avatars'],
    featured: true,
    publicationId: 'yan-2026-architecthead',
    authors: ['Peizhi Yan', 'Rabab Ward', 'Qiang Tang', 'Shan Du'],
    affiliations: ['The University of British Columbia'],
    overview: [
      '3D Gaussian head avatars can render photorealistic faces in real time, but their Gaussian count is normally fixed after training. ArchitectHead introduces continuous level-of-detail control so one trained avatar can adapt its representation to different quality and compute budgets.',
      'The approach is intended for applications that need to vary rendering complexity dynamically, including interactive and resource-constrained experiences.',
    ],
    contributions: [
      'Introduces continuous level-of-detail control for 3D Gaussian head avatars without retraining separate models.',
      'Represents Gaussian attributes through a multi-level UV feature field that can be sampled at different resolutions.',
      'Maintains strong reenactment quality while substantially reducing the Gaussian count at lower detail levels.',
    ],
    method:
      'ArchitectHead parameterizes Gaussians in a 2D UV feature space. Multi-level learnable feature maps encode latent attributes, and a lightweight decoder converts sampled features into renderable 3D Gaussians. Resampling the UV feature field at a requested resolution changes the number of active Gaussians continuously.',
    results:
      'The official evaluation reports state-of-the-art quality at the highest detail level and near state-of-the-art quality at lower levels. At its lowest setting, the representation uses only a small fraction of the full Gaussian count while rendering speed nearly doubles.',
  },
  {
    slug: 'trisim',
    title: 'TriSim',
    subtitle:
      'Tri-Dimensional Similarity Modeling with Extreme Value Theory for False-Negative Mitigation in Remote Sensing Image-Text Retrieval',
    summary:
      'A remote-sensing retrieval framework that models image–image, image–text, and text–text similarities to identify and reduce false-negative training signals.',
    overviewImage: '/images/projects/trisim-placeholder.jpg',
    imageAlt:
      'Illustrative placeholder showing remote-sensing imagery, a three-dimensional similarity space, and text features',
    visualCaption:
      'Illustrative placeholder generated for this site; it is not a figure or result from the paper.',
    venue: 'CVPR',
    venueLong: 'IEEE/CVF Conference on Computer Vision and Pattern Recognition',
    year: 2026,
    paperUrl:
      'https://openaccess.thecvf.com/content/CVPR2026/papers/Zheng_TriSim_Tri-Dimensional_Similarity_Modeling_with_Extreme_Value_Theory_for_False-Negative_CVPR_2026_paper.pdf',
    tags: ['Remote Sensing', 'Vision–Language', 'Cross-Modal Retrieval'],
    featured: true,
    publicationId: 'zheng-2026-trisim',
    authors: ['Chengyu Zheng', 'Hanzhang Lu', 'Jie Nie', 'Shan Du'],
    affiliations: ['The University of British Columbia', 'Ocean University of China'],
    overview: [
      'Contrastive remote-sensing image–text retrieval can mistakenly treat semantically related samples as negatives. Similarity thresholds alone are fragile because they do not capture the overlap and gaps between visual and textual modalities.',
      'TriSim builds a joint space from image–image, image–text, and text–text similarity, then treats likely false negatives as tail events rather than relying on a single cross-modal threshold.',
    ],
    contributions: [
      'Models three complementary similarity relationships for more reliable false-negative analysis.',
      'Uses extreme-value reasoning and complementary tail-selection strategies to detect anomalous candidate negatives.',
      'Refines candidate weighting with saliency differences that emphasize discriminative regions and suppress ambiguity.',
    ],
    method:
      'TriSim constructs a three-dimensional negative-similarity space and selects tail samples using distance from a dense ellipsoidal center together with high-similarity extremes. The selected samples guide triplet-loss optimization, while intra-modal saliency differences produce masks for a learned gain matrix.',
    results:
      'Experiments on two remote-sensing image–text retrieval benchmarks show improved robustness to false negatives and stronger retrieval performance than the compared approaches.',
  },
  {
    slug: 'jvlgs',
    title: 'JVLGS',
    subtitle: 'Joint Vision–Language Gas Leak Segmentation',
    summary:
      'A vision–language system that combines video evidence and text prompts to segment gas leaks under supervised and limited-data settings.',
    overviewImage: 'https://raw.githubusercontent.com/GeekEagle/JVLGS/main/assets/fig1_framework.png',
    imageAlt: 'JVLGS framework for joint vision-language gas leak segmentation',
    visualCaption: 'Framework overview from the official JVLGS repository.',
    venue: 'TVC',
    venueLong: 'The Visual Computer',
    year: 2026,
    paperUrl: 'https://doi.org/10.1007/s00371-026-04591-y',
    codeUrl: 'https://github.com/GeekEagle/JVLGS',
    tags: ['Video Segmentation', 'Vision–Language', 'Industrial Inspection'],
    featured: true,
    publicationId: 'zhao-2026-jvlgs',
    authors: ['Xinlong Zhao', 'Qixiang Pang', 'Shan Du'],
    affiliations: ['The University of British Columbia'],
    overview: [
      'Gas plumes are transparent, deform continuously, and often blend into complex backgrounds. JVLGS brings language guidance into video segmentation so the model can combine visual motion with semantic descriptions of the target.',
      'The framework is evaluated in conventional supervised training as well as limited-data settings where language guidance can provide useful additional context.',
    ],
    contributions: [
      'Combines visual video features and text prompts in a unified gas-leak segmentation framework.',
      'Captures spatial and temporal evidence to distinguish faint moving plumes from background appearance changes.',
      'Adds adaptive post-processing to suppress false-positive regions and stabilize predicted masks.',
    ],
    method:
      'JVLGS extracts complementary features from consecutive video frames and a language prompt, fuses them through a joint vision–language architecture, and applies temporal-spatial reasoning before producing the segmentation mask. Adaptive post-processing removes unlikely detections.',
    results:
      'The reported experiments show competitive gas-leak segmentation in fully supervised settings and useful generalization when only a small amount of labeled training data is available.',
  },
  {
    slug: 'langgas',
    title: 'LangGas',
    subtitle: 'Language-Guided Zero-Shot Gas-Leak Segmentation with SimGas',
    summary:
      'A zero-shot gas-leak detection pipeline and synthetic benchmark that combine background subtraction, language-guided object filtering, and promptable segmentation.',
    overviewImage:
      'https://github.com/user-attachments/assets/02debfe3-7da5-47e3-8720-d70cf3aee802',
    imageAlt:
      'LangGas pipeline combining video background subtraction, text prompts, object filtering, and segmentation',
    visualCaption: 'Method overview from the official LangGas repository.',
    venue: 'CVPRW',
    venueLong: 'IEEE/CVF Conference on Computer Vision and Pattern Recognition Workshops',
    year: 2025,
    paperUrl:
      'https://openaccess.thecvf.com/content/CVPR2025W/PBVS/papers/Guo_LangGas_Introducing_Language_in_Selective_Zero-Shot_Background_Subtraction_for_Semi-Transparent_CVPRW_2025_paper.pdf',
    codeUrl: 'https://github.com/weathon/Lang-Gas',
    tags: ['Zero-Shot Segmentation', 'Vision–Language', 'Gas Leak Detection'],
    featured: false,
    publicationId: 'guo-2025-langgas',
    authors: ['Wenqi Guo', 'Yiyang Du', 'Shan Du'],
    affiliations: ['The University of British Columbia', 'Weathon Software'],
    overview: [
      'Gas plumes are semi-transparent, deform over time, and are difficult to label at scale. LangGas addresses both the data shortage and the detection problem through SimGas, a synthetic video dataset with varied scenes, distractors, leak locations, and pixel-level ground truth.',
      'The accompanying method uses language to distinguish plume-like motion from foreground objects, enabling segmentation without task-specific model training.',
    ],
    contributions: [
      'Introduces SimGas, a synthetic gas-leak dataset with precise segmentation masks and diverse scene conditions.',
      'Combines enhanced background subtraction with zero-shot object detection and language-based filtering.',
      'Uses promptable segmentation and temporal filtering to turn retained detections into stable plume masks.',
    ],
    method:
      'The pipeline first enhances frame differences produced by background subtraction. A text prompt guides zero-shot object detection, non-maximum suppression and temporal logic remove implausible regions, and SAM 2 segments the remaining candidate plume regions.',
    results:
      'On SimGas, the full pipeline reaches an overall IoU of 69%, outperforming baselines based only on background subtraction or zero-shot detection and segmentation. The authors also report qualitative transfer to the real-world GasVid dataset.',
  },
  {
    slug: 'neural-3d-face-stylization',
    title: 'Neural 3D Face Stylization',
    subtitle: 'Single-Template Shape Stylization through Weakly Supervised Learning',
    summary:
      'A learning-based deformation-transfer method that stylizes new 3D faces from a single artist-created style template without paired training data.',
    overviewImage: 'https://yan.auroratns.com/docs/style/stylization_results-usethis.png',
    imageAlt: 'Examples of realistic 3D faces transformed into several stylized shapes',
    visualCaption: 'Stylization examples from the official project page.',
    venue: 'TVCG',
    venueLong: 'IEEE Transactions on Visualization and Computer Graphics',
    year: 2025,
    projectUrl: 'https://yan.auroratns.com/docs/style/index.html',
    paperUrl: 'https://ieeexplore.ieee.org/stamp/stamp.jsp?arnumber=11015267',
    tags: ['3D Faces', 'Shape Stylization', 'Weak Supervision'],
    featured: false,
    publicationId: 'yan-2025-neural-face-stylization',
    authors: ['Peizhi Yan', 'Rabab K. Ward', 'Qiang Tang', 'Shan Du'],
    affiliations: ['The University of British Columbia', 'Huawei Technologies Canada'],
    overview: [
      'Traditional deformation transfer can preserve a person’s facial characteristics in a stylized template, but it is slow and must be optimized again for every new face. This work learns the transfer once and applies it directly to new inputs.',
      'Only one style template is needed for each target look, reducing artist effort and avoiding paired realistic-to-stylized training meshes.',
    ],
    contributions: [
      'Frames 3D face shape stylization as a fast learned deformation-transfer problem.',
      'Uses weak supervision so paired source and stylized training data are not required.',
      'Introduces template-guided mesh smoothing to preserve the intended structure of each style.',
    ],
    method:
      'A neural network predicts the deformation from a realistic input face to a chosen style template. Training uses weak supervision and a template-guided mesh-smoothing regularizer that discourages structural artifacts while retaining identity-related facial shape.',
    results:
      'The paper reports stylization quality comparable to conventional deformation transfer at roughly 3,000 times the processing speed, with an average Chamfer distance of about 0.01 mm.',
  },
  {
    slug: 'stylemorpheus',
    title: 'StyleMorpheus',
    subtitle: 'A StyleGAN-Based 3D-Aware Morphable Face Model with a Disentangled Style Space',
    summary:
      'A style-based neural 3D morphable model trained on in-the-wild images for controllable, photorealistic face reconstruction and editing.',
    overviewImage: 'https://yan.auroratns.com/docs/morpheus/resources/teaser.png',
    imageAlt: 'StyleMorpheus face reconstruction, view synthesis, and editing examples',
    visualCaption: 'StyleMorpheus overview from the official project page.',
    venue: 'Neurocomputing',
    venueLong: 'Neurocomputing',
    year: 2025,
    projectUrl: 'https://yan.auroratns.com/docs/morpheus/index.html',
    paperUrl: 'https://doi.org/10.1016/j.neucom.2025.131329',
    tags: ['3D Faces', 'Generative Models', 'Neural Rendering'],
    featured: false,
    publicationId: 'yan-2025-stylemorpheus',
    authors: ['Peizhi Yan', 'Rabab K. Ward', 'Dan Wang', 'Qiang Tang', 'Shan Du'],
    affiliations: ['The University of British Columbia', 'Huawei Technologies Canada'],
    overview: [
      'StyleMorpheus learns a neural 3D morphable face model from unconstrained images instead of requiring a large collection of accurately reconstructed 3D scans.',
      'Its style-based latent design separates identity, expression, and appearance controls while retaining photorealistic, 3D-aware rendering.',
    ],
    contributions: [
      'Learns a style-based neural 3D morphable model from in-the-wild face images.',
      'Separates shape- and appearance-related controls across the model to improve disentanglement.',
      'Supports real-time rendering and downstream editing operations such as style mixing and color manipulation.',
    ],
    method:
      'An autoencoder maps face images into a disentangled parametric code space. Shape- and appearance-related style codes control different decoder modules, and style-based adversarial fine-tuning improves photorealistic 3D-aware rendering.',
    results:
      'The model is evaluated on face reconstruction and novel-view synthesis and demonstrates controllable identity, expression, and appearance editing at real-time rendering speed.',
  },
  {
    slug: 'gaussian-dejavu',
    title: 'Gaussian Deja-vu',
    subtitle:
      'Controllable 3D Gaussian Head Avatars with Enhanced Generalization and Personalization',
    summary:
      'A 3D Gaussian head-avatar method designed to accelerate personalization while improving controllability and photorealistic rendering.',
    overviewImage: 'https://yan.auroratns.com/docs/dejavu/teaser.png',
    imageAlt: 'Gaussian Deja-vu controllable head-avatar examples',
    visualCaption: 'Controllable avatar examples from the official Gaussian Deja-vu project page.',
    venue: 'WACV',
    venueLong: 'IEEE/CVF Winter Conference on Applications of Computer Vision',
    year: 2025,
    projectUrl: 'https://yan.auroratns.com/docs/dejavu/index.html',
    paperUrl:
      'https://openaccess.thecvf.com/content/WACV2025/papers/Yan_Gaussian_Deja-vu_Creating_Controllable_3D_Gaussian_Head-Avatars_with_Enhanced_Generalization_WACV_2025_paper.pdf',
    codeUrl: 'https://github.com/PeizhiYan/gaussian-dejavu',
    tags: ['Gaussian Splatting', 'Head Avatars', 'Neural Rendering'],
    featured: false,
    publicationId: 'yan-2025-gaussian-dejavu',
    authors: ['Peizhi Yan', 'Rabab Ward', 'Qiang Tang', 'Shan Du'],
    affiliations: ['The University of British Columbia', 'Huawei Technologies Canada'],
    overview: [
      'Personalized head avatars often require a lengthy per-person optimization process. Gaussian Deja-vu targets both generalization to a new identity and efficient personalization while preserving explicit control over expression and pose.',
      'The method uses 3D Gaussian rendering to retain real-time performance and high-frequency appearance detail.',
    ],
    contributions: [
      'Combines generalizable initialization with efficient identity-specific personalization.',
      'Builds controllable head avatars around a real-time 3D Gaussian representation.',
      'Improves personalized avatar quality while reducing the time needed to adapt to a new subject.',
    ],
    method:
      'Gaussian Deja-vu learns reusable priors across identities and then adapts the Gaussian avatar representation to a target subject. Facial controls drive the personalized representation while the Gaussian renderer produces novel views in real time.',
    results:
      'The WACV evaluation reports faster personalization and improved photorealistic avatar quality, together with controllable expression and pose rendering.',
  },
  {
    slug: 'fgstp',
    title: 'FGSTP',
    subtitle: 'Fine-Grained Spatial-Temporal Perception for Gas Leak Segmentation',
    summary:
      'A video segmentation framework that combines motion correlations with fine-grained spatial refinement to recover faint gas plumes and their boundaries.',
    overviewImage:
      'https://github.com/user-attachments/assets/ddc013d2-86d0-4975-a2db-a393e3bcf790',
    imageAlt: 'FGSTP gas leak segmentation architecture and example masks',
    visualCaption: 'Framework overview from the official FGSTP repository.',
    venue: 'ICIP',
    venueLong: 'IEEE International Conference on Image Processing',
    year: 2025,
    paperUrl: 'https://ieeexplore.ieee.org/document/11084304',
    codeUrl: 'https://github.com/GeekEagle/FGSTP',
    tags: ['Video Segmentation', 'Motion Analysis', 'Industrial Inspection'],
    featured: false,
    publicationId: 'zhao-2025-fgstp',
    authors: ['Xinlong Zhao', 'Shan Du'],
    affiliations: ['The University of British Columbia'],
    overview: [
      'Gas leaks have weak texture, translucent boundaries, and highly variable motion. FGSTP combines temporal correspondence with local spatial detail so the model can follow plume movement without losing fine boundaries.',
      'The work also introduces GasVid, a manually annotated video dataset created for evaluating gas-leak segmentation.',
    ],
    contributions: [
      'Builds a correlation volume across consecutive frames to expose motion cues from subtle plume movement.',
      'Refines spatial detail and boundaries through a dedicated fine-grained decoder.',
      'Introduces a manually labeled gas-leak video dataset for training and evaluation.',
    ],
    method:
      'FGSTP extracts features from adjacent frames, computes their correlation volume, and combines the resulting temporal evidence with spatial features. A boundary-aware decoder progressively refines the predicted gas mask.',
    results:
      'Experiments on GasVid show that combining motion correlation and spatial refinement improves segmentation accuracy, particularly around faint and irregular plume boundaries.',
  },
  {
    slug: 'cppmn',
    title: 'CPPMN',
    subtitle: 'Cross-Modal Progressive Perspective Matching for Remote Sensing Image–Text Retrieval',
    summary:
      'A progressive matching network that models multiple geographic perspectives and aligns remote-sensing images with textual queries.',
    overviewImage: '/images/projects/cppmn-placeholder.jpg',
    imageAlt:
      'Illustrative placeholder showing progressive graph alignment between remote-sensing imagery and text',
    visualCaption:
      'Illustrative placeholder generated for this site; it is not a figure or result from the paper.',
    venue: 'TMM',
    venueLong: 'IEEE Transactions on Multimedia',
    year: 2025,
    paperUrl: 'https://doi.org/10.1109/TMM.2025.3535365',
    tags: ['Remote Sensing', 'Cross-Modal Retrieval', 'Transformers'],
    featured: false,
    publicationId: 'zheng-2025-cppmn',
    authors: ['Chengyu Zheng', 'Xiu Li', 'Xinyue Liang', 'Lei Huang', 'Shan Du', 'Jie Nie', 'Junyu Dong'],
    affiliations: ['Ocean University of China', 'The University of British Columbia'],
    overview: [
      'Remote-sensing scenes can be described from multiple geographic perspectives. Retrieval systems that collapse those perspectives into one representation may match a query to the wrong region or overlook the relevant spatial relationship.',
      'CPPMN progressively learns full-image perspectives, exposes perspective-specific cross-modal relationships, and then aligns image and language features semantically.',
    ],
    contributions: [
      'Uses positive text descriptions to supervise full-perspective visual feature learning.',
      'Transforms implicit perspective features into explicit cross-modal relationship graphs.',
      'Applies cascaded Transformer layers for progressive image–text semantic alignment.',
    ],
    method:
      'The network combines a compensation module for full-perspective modeling, a graph transformation module for locating individual perspectives, and a cascaded Transformer for cross-modal semantic alignment. Graph density and connectivity help identify the perspective referred to by the query.',
    results:
      'Quantitative and qualitative experiments across four remote-sensing image–text retrieval datasets demonstrate the value of progressive perspective matching and semantic alignment.',
  },
  {
    slug: 'satellite-methane-wwt',
    title: 'Satellite Methane Monitoring for Wastewater Treatment',
    subtitle: 'Long-Term Emission Analysis from Sentinel-2 Remote-Sensing Imagery',
    summary:
      'A five-year satellite study of methane concentration patterns over a wastewater treatment plant, including temporal variation and emission-hotspot analysis.',
    overviewImage: '/images/projects/methane-satellite-placeholder.png',
    imageAlt:
      'Illustrative satellite view of a wastewater treatment facility with false-color methane monitoring overlays',
    visualCaption:
      'Illustrative placeholder generated for this site; it is not a satellite observation or result from the paper.',
    venue: 'Remote Sensing',
    venueLong: 'Remote Sensing',
    year: 2024,
    paperUrl: 'https://doi.org/10.3390/rs16234422',
    tags: ['Remote Sensing', 'Methane Monitoring', 'Environmental Vision'],
    featured: false,
    publicationId: 'mehrdad-2024-satellite-methane',
    authors: ['Seyed Mostafa Mehrdad', 'Bo Zhang', 'Wenqi Guo', 'Shan Du', 'Ke Du'],
    affiliations: [
      'University of Calgary',
      'The University of British Columbia',
      'Stantec',
      'Weathon Software',
    ],
    overview: [
      'Short measurement campaigns provide only snapshots of fugitive methane emissions from wastewater treatment. This study investigates whether frequently available satellite imagery can reveal longer-term spatial and temporal patterns instead.',
      'The analysis covers Sentinel-2 observations of a Calgary wastewater treatment plant from 2019 through 2023, providing a multi-year view of daily, monthly, seasonal, and annual variation.',
    ],
    contributions: [
      'Evaluates high-spatial-resolution Sentinel-2 imagery for long-term wastewater methane monitoring.',
      'Develops image-processing techniques for extracting spatial and temporal concentration patterns.',
      'Identifies candidate emission hotspots and compares them with ground-based measurements.',
    ],
    method:
      'The study processes multi-year Sentinel-2 imagery to retrieve methane column-concentration distributions over the plant. Digital image-processing steps aggregate and compare those distributions across daily, monthly, seasonal, and annual timescales and locate recurring spatial hotspots.',
    results:
      'The recovered patterns show substantial spatial and temporal variation and identify hotspots consistent with ground observations. The paper presents satellite imagery as a cost-effective complement to continuous monitoring while noting limitations from clouds, atmospheric scattering, and sensor resolution.',
  },
  {
    slug: 'headnerf-plus',
    title: 'HeadNeRF+',
    subtitle: 'Learning Disentangled Features for NeRF-Based Face Reconstruction',
    summary:
      'An encoder-based reconstruction framework that predicts disentangled HeadNeRF features directly and adds semantic facial-part supervision.',
    overviewImage: 'https://yan.auroratns.com/docs/headnerf+/resources/teaser.jpg',
    imageAlt: 'HeadNeRF+ face reconstruction comparisons and disentangled controls',
    visualCaption: 'HeadNeRF+ reconstruction examples from the official project page.',
    venue: 'ICIP',
    venueLong: 'IEEE International Conference on Image Processing',
    year: 2023,
    projectUrl: 'https://yan.auroratns.com/docs/headnerf+/index.html',
    paperUrl: 'https://ieeexplore.ieee.org/document/10222432',
    tags: ['NeRF', '3D Face Reconstruction', 'Disentanglement'],
    featured: false,
    publicationId: 'yan-2023-headnerf-plus',
    authors: ['Peizhi Yan', 'Rabab Ward', 'Dan Wang', 'Qiang Tang', 'Shan Du'],
    affiliations: ['The University of British Columbia', 'Huawei Technologies Canada'],
    overview: [
      'HeadNeRF can render photorealistic, controllable faces, but fitting its latent codes to each image is slow and prone to overfitting. HeadNeRF+ replaces iterative fitting with a learned encoder that directly predicts the disentangled reconstruction features.',
      'The framework also introduces explicit semantic face-part guidance even though the underlying NeRF does not expose a conventional mesh.',
    ],
    contributions: [
      'Predicts HeadNeRF’s disentangled identity, expression, and appearance features directly from an input image.',
      'Adds a lightweight semantic face-segmentation network to expose facial-part structure.',
      'Uses a facial-part loss to improve reconstruction accuracy and local visual quality.',
    ],
    method:
      'A face encoder estimates the latent parameters consumed by a pretrained HeadNeRF renderer. A lightweight segmentation branch supplies semantic facial regions, and part-aware losses guide the encoder toward more accurate local reconstruction.',
    results:
      'The experiments report much lower reconstruction time than per-image fitting together with improved reconstruction accuracy and visual quality.',
  },
  {
    slug: 'neo-3df',
    title: 'NEO-3DF',
    subtitle: 'Novel Editing-Oriented 3D Face Creation and Reconstruction',
    summary:
      'A semantic part-based face model that makes reconstructed 3D faces locally editable while improving their alignment to a source image.',
    overviewImage: 'https://yan.auroratns.com/docs/neo3df/resources/teaser.png',
    imageAlt: 'NEO-3DF face reconstruction and local editing examples',
    visualCaption: 'NEO-3DF reconstruction and editing overview from the official project page.',
    venue: 'ACCV',
    venueLong: 'Asian Conference on Computer Vision',
    year: 2022,
    projectUrl: 'https://yan.auroratns.com/docs/neo3df/index.html',
    paperUrl:
      'https://openaccess.thecvf.com/content/ACCV2022/papers/Yan_NEO-3DF_Novel_Editing-Oriented_3D_Face_Creation_and_Reconstruction_ACCV_2022_paper.pdf',
    codeUrl: 'https://github.com/ubc-3d-vision-lab/NEO-3DF',
    tags: ['3D Faces', 'Reconstruction', 'Shape Editing'],
    featured: false,
    publicationId: 'yan-2022-neo-3df',
    authors: ['Peizhi Yan', 'James Gregson', 'Qiang Tang', 'Rabab Ward', 'Zhan Xu', 'Shan Du'],
    affiliations: ['The University of British Columbia'],
    overview: [
      'NEO-3DF treats reconstruction and editing as connected tasks. Its face model is divided into semantic parts, each with intuitive controls such as nose height, so users can adjust local shape after reconstructing a face from one image.',
      'A differentiable blending module adjusts the shape and placement of the parts so the assembled 3D face aligns more closely with the original photograph.',
    ],
    contributions: [
      'Introduces independent semantic face-part submodels with local, interpretable editing controls.',
      'Uses differentiable part blending to improve both editing continuity and 3D-to-2D alignment.',
      'Connects face reconstruction and post-reconstruction editing in one optimization framework.',
    ],
    method:
      'Each semantic face region is represented by a controllable submodel. The part parameters can be edited independently, while a differentiable blender assembles the parts and optimizes their shapes and placements against the source image.',
    results:
      'The paper reports more intuitive local editing than prior global face models and a 14% improvement in 3D-to-2D alignment IoU.',
    acknowledgements:
      'The original project acknowledges support from the University of British Columbia Okanagan under grant GR017752.',
  },
];

export const getProject = (slug: string) => projects.find((project) => project.slug === slug);
