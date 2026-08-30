---
title: Imbalance Satellite Image Colorization with Semantic Salience Priors
subtitle: Semantically guided colorization for imbalanced satellite imagery
summary: A satellite-image colorization method that uses semantic salience priors to guide plausible colors under strongly imbalanced scene distributions.
publication: zheng-2021-imbalance-colorization
image:
  src: /images/projects/satellite-image-colorization.webp
  alt: Semantic-salience-guided satellite image colorization pipeline and example results
  caption: Method overview supplied by the project author.
tags:
  - Remote Sensing
  - Image Colorization
  - Semantic Guidance
featured: false
order: 2
---

## I. Overview

Satellite-image colorization is under-constrained: many colors may be plausible for a grayscale input, while dominant land-cover types can bias a model toward frequent outputs. This work introduces semantic salience priors to emphasize meaningful scene regions during color prediction.

---

## II. Key Contributions

- Incorporates semantic salience into satellite-image colorization.
- Addresses imbalance among common and infrequent scene content.
- Guides color prediction with higher-level scene information in addition to local intensity.

---

## III. Methodology

The supplied overview shows a learned colorization pipeline augmented by semantic and saliency cues. These priors reweight or refine visual features so the decoder can assign colors according to scene content rather than frequency alone.

---

## IV. Research Focus

The project explores how semantic structure can stabilize colorization when training data contain uneven land-cover and color distributions.
