---
title: "Position: Universal Aesthetic Alignment Narrows Artistic Expression"
subtitle: How a single notion of beauty can override diverse artistic intent
summary: A position paper and benchmark study showing how image generators and reward models can override requests for unconventional, abstract, or deliberately anti-aesthetic imagery.
publication: guo-2026-aesthetic-alignment
image:
  src: /images/projects/aesthetic-alignment.webp
  alt: Paired anti-aesthetic and conventionally clean generated images with comparative reward scores
  caption: Wide-spectrum aesthetic comparison supplied by the project author.
tags:
  - Generative AI
  - AI Alignment
  - Aesthetic Diversity
featured: true
featuredOrder: 2
order: 24
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
