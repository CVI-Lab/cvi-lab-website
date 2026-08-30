---
title: Scale–Relation Joint Decoupling Network for Remote Sensing Image Semantic Segmentation
subtitle: Jointly separating scale variation and contextual relationships
summary: A remote-sensing segmentation framework that decouples multi-scale visual patterns and region relationships before recombining them for dense prediction.
publication: nie-2022-scale-relation-joint-decoupling
image:
  src: /images/projects/scale-relation-joint-decoupling.webp
  alt: Scale-relation joint decoupling architecture for semantic segmentation of remote-sensing images
  caption: Method overview supplied by the project author.
tags:
  - Remote Sensing
  - Semantic Segmentation
  - Multi-Scale Learning
featured: false
order: 3
---

## I. Overview

Objects in overhead imagery vary greatly in size, and their class can depend on relationships with surrounding regions. This network addresses both challenges by separating scale-specific information and contextual relations before learning how to combine them.

---

## II. Key Contributions

- Decouples feature responses associated with different spatial scales.
- Models contextual relations as a complementary source of segmentation evidence.
- Jointly aggregates the scale and relation branches for dense scene labeling.

---

## III. Methodology

The architecture extracts hierarchical image features and sends them through scale-decoupling and relation-decoupling components. Their outputs are refined and fused into a joint representation used by the segmentation decoder.

---

## IV. Research Focus

The project studies how explicit separation can prevent large scene structures from overwhelming small objects while retaining the long-range context needed for coherent predictions.
