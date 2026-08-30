---
title: Neural 3D Face Shape Stylization Based on Single Style Template via Weakly Supervised Learning
subtitle: Fast 3D face stylization from one artist-created template
summary: A learning-based deformation-transfer method that stylizes new 3D faces from a single artist-created style template without paired training data.
publication: yan-2025-neural-face-stylization
image:
  src: /images/projects/neural-3d-face-stylization.webp
  alt: Neural network pipeline transferring a single stylized template to new 3D face shapes
  caption: Neural 3D face stylization method overview supplied by the project author.
tags:
  - 3D Faces
  - Shape Stylization
  - Weak Supervision
featured: false
order: 14
---

## I. Overview

Traditional deformation transfer can preserve a person’s facial characteristics in a stylized template, but it is slow and must be optimized again for every new face. This work learns the transfer once and applies it directly to new inputs.

Only one style template is needed for each target look, reducing artist effort and avoiding paired realistic-to-stylized training meshes.

---

## II. Key Contributions

- Frames 3D face shape stylization as a fast learned deformation-transfer problem.
- Uses weak supervision so paired source and stylized training data are not required.
- Introduces template-guided mesh smoothing to preserve the intended structure of each style.

---

## III. Methodology

A neural network predicts the deformation from a realistic input face to a chosen style template. Training uses weak supervision and a template-guided mesh-smoothing regularizer that discourages structural artifacts while retaining identity-related facial shape.

---

## IV. Main Findings

The paper reports stylization quality comparable to conventional deformation transfer at roughly 3,000 times the processing speed, with an average Chamfer distance of about 0.01 mm.
