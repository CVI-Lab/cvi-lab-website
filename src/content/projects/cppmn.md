---
title: CPPMN
subtitle: Cross-Modal Progressive Perspective Matching for Remote Sensing Image–Text Retrieval
summary: A progressive matching network that models multiple geographic perspectives and aligns remote-sensing images with textual queries.
publication: zheng-2025-cppmn
image:
  src: /images/projects/cppmn-placeholder.jpg
  alt: Illustrative placeholder showing progressive graph alignment between remote-sensing imagery and text
  caption: Illustrative placeholder generated for this site; it is not a figure or result from the paper.
tags:
  - Remote Sensing
  - Cross-Modal Retrieval
  - Transformers
featured: false
order: 4
---

## I. Overview

Remote-sensing scenes can be described from multiple geographic perspectives. Retrieval systems that collapse those perspectives into one representation may match a query to the wrong region or overlook the relevant spatial relationship.

CPPMN progressively learns full-image perspectives, exposes perspective-specific cross-modal relationships, and then aligns image and language features semantically.

---

## II. Key Contributions

- Uses positive text descriptions to supervise full-perspective visual feature learning.
- Transforms implicit perspective features into explicit cross-modal relationship graphs.
- Applies cascaded Transformer layers for progressive image–text semantic alignment.

---

## III. Methodology

The network combines a compensation module for full-perspective modeling, a graph transformation module for locating individual perspectives, and a cascaded Transformer for cross-modal semantic alignment. Graph density and connectivity help identify the perspective referred to by the query.

---

## IV. Main Findings

Quantitative and qualitative experiments across four remote-sensing image–text retrieval datasets demonstrate the value of progressive perspective matching and semantic alignment.
