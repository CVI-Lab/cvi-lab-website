---
title: Universal Aesthetic Alignment
subtitle: Why a Single Notion of Beauty Narrows Artistic Expression
summary: A position paper and benchmark study showing how image generators and reward models can override requests for unconventional, abstract, or deliberately anti-aesthetic imagery.
publication: guo-2026-aesthetic-alignment
image:
  src: https://weathon.github.io/icml2026_position/site/img/local/demo.jpg
  alt: Examples of deliberately unconventional generated scenes used to study aesthetic alignment
  caption: Wide-spectrum aesthetic examples from the official project page.
tags:
  - Generative AI
  - AI Alignment
  - Aesthetic Diversity
featured: true
featuredOrder: 2
order: 13
---

## I. Overview

Image-generation systems are commonly optimized toward a broad, average notion of visual appeal. This paper argues that the same preference can conflict with user intent when a request deliberately calls for abstraction, discomfort, visual roughness, or other non-mainstream aesthetics.

The authors call this reversed alignment: instead of adapting to the user’s stated aesthetic goal, the system steers the output back toward the developer’s preferred visual norm.

---

## II. Key Contributions

- Frames universal aesthetic optimization as an alignment and user-autonomy problem rather than only an image-quality concern.
- Builds a wide-spectrum aesthetics benchmark for testing whether generators follow unconventional visual instructions.
- Studies generation, image-to-image editing, reward-model scoring, and the treatment of recognized abstract artworks.

---

## III. Methodology

The study expands ordinary image descriptions with controlled wide-spectrum aesthetic attributes, compares generated outputs against those requests, and evaluates how aesthetic reward models score prompt-following but conventionally unattractive images. It also tests image editing and real artworks to separate prompt adherence from generic beauty preference.

---

## IV. Main Findings

Across the evaluated generators and reward models, the study finds a recurring preference for conventionally polished imagery. Systems often beautify or sanitize deliberately unconventional requests, while reward models can penalize outputs that follow those requests more faithfully.
