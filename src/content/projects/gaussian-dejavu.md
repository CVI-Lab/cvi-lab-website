---
title: Gaussian Deja-vu
subtitle: Controllable 3D Gaussian Head Avatars with Enhanced Generalization and Personalization
summary: A 3D Gaussian head-avatar method designed to accelerate personalization while improving controllability and photorealistic rendering.
publication: yan-2025-gaussian-dejavu
image:
  src: https://yan.auroratns.com/docs/dejavu/teaser.png
  alt: Gaussian Deja-vu controllable head-avatar examples
  caption: Controllable avatar examples from the official Gaussian Deja-vu project page.
tags:
  - Gaussian Splatting
  - Head Avatars
  - Neural Rendering
featured: false
order: 6
---

## I. Overview

Personalized head avatars often require a lengthy per-person optimization process. Gaussian Deja-vu targets both generalization to a new identity and efficient personalization while preserving explicit control over expression and pose.

The method uses 3D Gaussian rendering to retain real-time performance and high-frequency appearance detail.

---

## II. Key Contributions

- Combines generalizable initialization with efficient identity-specific personalization.
- Builds controllable head avatars around a real-time 3D Gaussian representation.
- Improves personalized avatar quality while reducing the time needed to adapt to a new subject.

---

## III. Methodology

Gaussian Deja-vu learns reusable priors across identities and then adapts the Gaussian avatar representation to a target subject. Facial controls drive the personalized representation while the Gaussian renderer produces novel views in real time.

---

## IV. Main Findings

The WACV evaluation reports faster personalization and improved photorealistic avatar quality, together with controllable expression and pose rendering.
