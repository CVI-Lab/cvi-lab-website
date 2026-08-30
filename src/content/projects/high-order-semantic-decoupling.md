---
title: High-Order Semantic Decoupling Network for Remote Sensing Image Semantic Segmentation
subtitle: Separating high-order semantic relationships for dense scene understanding
summary: A semantic-segmentation network that decouples high-order contextual relationships to improve dense labeling of complex remote-sensing imagery.
publication: zheng-2023-high-order-semantic-decoupling
image:
  src: /images/projects/high-order-semantic-decoupling.webp
  alt: High-Order Semantic Decoupling Network architecture for remote-sensing image segmentation
  caption: Method overview supplied by the project author.
tags:
  - Remote Sensing
  - Semantic Segmentation
  - Context Modeling
featured: false
order: 7
---

## I. Overview

Dense remote-sensing segmentation must distinguish visually similar regions while preserving relationships across large spatial extents. This project decouples high-order semantic interactions so the model can reason about complementary contextual structures without collapsing them into one feature stream.

---

## II. Key Contributions

- Models high-order dependencies among semantic regions in remote-sensing scenes.
- Separates complementary contextual relationships before feature aggregation.
- Recombines decoupled semantics for pixel-level classification.

---

## III. Methodology

A convolutional feature extractor supplies multi-level visual representations. The semantic-decoupling stages shown in the supplied overview build and separate higher-order contextual relationships, then fuse the refined features into a dense segmentation prediction.

---

## IV. Research Focus

The method targets scenes where local appearance alone is ambiguous and broader semantic context is needed to assign consistent land-cover labels.
