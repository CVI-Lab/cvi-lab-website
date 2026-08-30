---
title: Cross-Scale Graph Interaction Network for Semantic Segmentation of Remote Sensing Images
subtitle: Graph-based interaction across feature scales for dense prediction
summary: A semantic-segmentation network that represents multi-scale remote-sensing features as interacting graphs to exchange local and global contextual information.
publication: nie-2023-cross-scale-graph-interaction
image:
  src: /images/projects/cross-scale-graph-interaction.webp
  alt: Cross-scale graph interaction network linking multi-resolution features for remote-sensing segmentation
  caption: Method overview supplied by the project author.
tags:
  - Remote Sensing
  - Semantic Segmentation
  - Graph Learning
featured: false
order: 5
---

## I. Overview

Feature pyramids provide useful representations at several spatial resolutions, but conventional fusion may not explicitly model how structures at one scale relate to those at another. This project builds graph interactions across scales to exchange contextual information before segmentation.

---

## II. Key Contributions

- Constructs graph representations from multi-scale visual features.
- Exchanges relational information across resolutions rather than fusing each scale independently.
- Integrates graph-refined context into a dense remote-sensing segmentation decoder.

---

## III. Methodology

A backbone extracts features at several resolutions. Graph nodes summarize spatial or semantic regions, cross-scale interaction modules propagate information between graph levels, and the refined representations are projected back to spatial feature maps for prediction.

---

## IV. Research Focus

The network targets classes whose recognition depends simultaneously on fine boundaries and broad geographic context.
