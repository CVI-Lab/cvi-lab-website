---
title: NEO-3DF
subtitle: Novel Editing-Oriented 3D Face Creation and Reconstruction
summary: A semantic part-based face model that makes reconstructed 3D faces locally editable while improving their alignment to a source image.
publication: yan-2022-neo-3df
image:
  src: https://yan.auroratns.com/docs/neo3df/resources/teaser.png
  alt: NEO-3DF face reconstruction and local editing examples
  caption: NEO-3DF reconstruction and editing overview from the official project page.
tags:
  - 3D Faces
  - Reconstruction
  - Shape Editing
featured: false
order: 1
---

## I. Overview

NEO-3DF treats reconstruction and editing as connected tasks. Its face model is divided into semantic parts, each with intuitive controls such as nose height, so users can adjust local shape after reconstructing a face from one image.

A differentiable blending module adjusts the shape and placement of the parts so the assembled 3D face aligns more closely with the original photograph.

---

## II. Key Contributions

- Introduces independent semantic face-part submodels with local, interpretable editing controls.
- Uses differentiable part blending to improve both editing continuity and 3D-to-2D alignment.
- Connects face reconstruction and post-reconstruction editing in one optimization framework.

---

## III. Methodology

Each semantic face region is represented by a controllable submodel. The part parameters can be edited independently, while a differentiable blender assembles the parts and optimizes their shapes and placements against the source image.

---

## IV. Main Findings

The paper reports more intuitive local editing than prior global face models and a 14% improvement in 3D-to-2D alignment IoU.

---

## V. Acknowledgements

The original project acknowledges support from the University of British Columbia Okanagan under grant GR017752.
