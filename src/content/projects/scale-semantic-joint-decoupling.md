---
title: Scale–Semantic Joint Decoupling Network for Image-Text Retrieval in Remote Sensing
subtitle: Separating scale-specific visual cues and shared cross-modal semantics
summary: A remote-sensing image–text retrieval network that jointly decouples visual scale information and semantic relationships for more precise matching.
publication: zheng-2023-scale-semantic-joint-decoupling
image:
  src: /images/projects/scale-semantic-joint-decoupling.webp
  alt: Scale-semantic joint decoupling network for remote-sensing image-text retrieval
  caption: Method overview supplied by the project author.
tags:
  - Remote Sensing
  - Cross-Modal Retrieval
  - Multi-Scale Learning
featured: false
order: 6
---

## I. Overview

The visual evidence corresponding to a caption may appear at different scales across remote-sensing images. This project separates scale-sensitive visual structure from shared semantic content and then learns how the two should interact during retrieval.

---

## II. Key Contributions

- Decouples multi-scale visual information to preserve objects at different resolutions.
- Separates semantic components used for image–text alignment.
- Jointly optimizes the scale and semantic representations for bidirectional retrieval.

---

## III. Methodology

Image and text encoders generate modality-specific features. Scale-decoupling modules refine the visual hierarchy, semantic-decoupling modules identify cross-modal concepts, and a joint matching stage combines them in the retrieval embedding space.

---

## IV. Research Focus

The method addresses retrieval settings where global scene appearance is similar across candidates but the caption refers to a structure visible at a particular scale.
