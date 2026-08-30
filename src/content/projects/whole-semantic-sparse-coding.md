---
title: Whole Semantic Sparse Coding Network for Remote Sensing Image-Text Retrieval
subtitle: Sparse semantic coding across local and global cross-modal representations
summary: A retrieval network that learns compact semantic codes from whole-scene and region-level representations to align remote-sensing imagery with language.
publication: zheng-2025-whole-semantic-sparse-coding
image:
  src: /images/projects/whole-semantic-sparse-coding.webp
  alt: Whole Semantic Sparse Coding Network architecture for remote-sensing image and text retrieval
  caption: Method overview supplied by the project author.
tags:
  - Remote Sensing
  - Cross-Modal Retrieval
  - Sparse Coding
featured: false
order: 18
---

## I. Overview

Remote-sensing scenes contain multiple objects, land-cover patterns, and spatial relationships that may be described at different levels of detail. Whole semantic sparse coding seeks a compact representation that retains both global scene meaning and discriminative local semantics.

---

## II. Key Contributions

- Integrates visual and textual features into a shared sparse semantic representation.
- Models information at multiple semantic scales instead of relying on one pooled feature.
- Uses structured cross-modal learning to improve the separation of semantically similar retrieval candidates.

---

## III. Methodology

Image and text encoders extract modality-specific features, which are projected into a shared semantic space. The sparse coding stages shown in the supplied architecture aggregate complementary local and global information while encouraging a compact set of active semantic components for matching.

---

## IV. Research Focus

The project investigates whether structured sparsity can reduce redundant scene information and emphasize the concepts most relevant to an image–text query.
