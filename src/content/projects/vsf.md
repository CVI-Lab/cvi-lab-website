---
title: "VSF: Simple, Efficient, and Effective Negative Guidance in Few-Step Image Generation Models By Value Sign Flip"
subtitle: Training-free negative guidance through attention value sign flipping
summary: A lightweight negative-prompt guidance method that suppresses unwanted concepts by flipping attention value vectors, without retraining the generation model.
publication: guo-2026-vsf
image:
  src: /images/projects/vsf.webp
  alt: VSF image-generation examples showing source prompts and concepts removed through negative guidance
  caption: VSF qualitative overview supplied by the project author.
tags:
  - Diffusion Models
  - Negative Guidance
  - Image Generation
featured: false
order: 22
---

## I. Overview

Few-step image and video generators are fast, but conventional classifier-free guidance is often ineffective at removing concepts named in a negative prompt. Existing alternatives can also require retraining or add substantial inference cost.

VSF introduces negative guidance directly inside attention, making it compatible with modern few-step diffusion and flow-matching architectures while keeping the implementation compact.

---

## II. Key Contributions

- Introduces value sign flipping as a training-free mechanism for suppressing negative-prompt concepts.
- Uses attention masking and token handling to localize negative guidance and reduce unintended changes.
- Evaluates the method on few-step image and video generation and releases code, a demo, and a ComfyUI integration.

---

## III. Methodology

VSF encodes positive and negative prompts together, identifies attention values associated with the negative tokens, and reverses their sign before the attention output is aggregated. A scale parameter controls suppression strength, while masks constrain where and how strongly negative guidance is applied.

---

## IV. Main Findings

Experiments on the NegGenBench prompt pairs report stronger negative-prompt adherence than the compared few-step guidance methods while retaining competitive image quality and positive-prompt fidelity. The method is demonstrated with Stable Diffusion 3.5 Turbo, Flux Schnell, and Wan image/video models.
