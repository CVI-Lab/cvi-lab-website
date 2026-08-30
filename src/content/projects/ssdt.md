---
title: "SSDT: Scale-Separation Semantic Decoupled Transformer for Semantic Segmentation of Remote Sensing Images"
subtitle: Transformer-based separation of scale and semantic context
summary: A remote-sensing segmentation transformer that separates scale-dependent features and semantic relationships before integrating them for dense prediction.
publication: zheng-2024-ssdt
image:
  src: /images/projects/ssdt.webp
  alt: SSDT architecture with scale-separation and semantic-decoupling transformer modules
  caption: SSDT method overview supplied by the project author.
tags:
  - Remote Sensing
  - Semantic Segmentation
  - Transformers
featured: false
order: 9
---

## I. Overview

Remote-sensing scenes combine large geographic structures with small, densely arranged objects. SSDT uses transformer components to separate scale-sensitive representations from semantic context and then coordinate them for pixel-level prediction.

---

## II. Key Contributions

- Introduces scale-separation modules for heterogeneous object sizes.
- Decouples semantic interactions to reduce interference among scene categories.
- Uses transformer attention to integrate long-range context into segmentation.

---

## III. Methodology

Multi-level visual features enter scale-separation and semantic-decoupling stages. Transformer attention models interactions within the refined representations, and a decoder fuses the resulting features to produce the final segmentation map.

---

## IV. Research Focus

The method is intended to preserve fine spatial detail while using broad scene context, especially when the same semantic category appears at markedly different scales.
