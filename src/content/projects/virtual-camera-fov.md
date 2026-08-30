---
title: Estimating Virtual Camera FOV to Reduce Perspective Shape Distortion in 2D-to-3D Face Reconstruction
subtitle: Camera field-of-view estimation for geometrically consistent face reconstruction
summary: A 2D-to-3D face reconstruction method that estimates virtual camera field of view to reduce perspective-driven distortion in recovered facial shape.
publication: yan-2025-camera-fov
image:
  src: /images/projects/virtual-camera-fov.webp
  alt: Face reconstruction pipeline estimating virtual camera field of view before recovering 3D shape
  caption: Virtual-camera FOV estimation overview supplied by the project author.
tags:
  - 3D Faces
  - Face Reconstruction
  - Camera Geometry
featured: false
order: 12
---

## I. Overview

Perspective effects vary with camera field of view and subject distance. If a 2D-to-3D face reconstruction method assumes an unsuitable virtual camera, it can explain image evidence by distorting the recovered facial shape. This project estimates the field of view as part of reconstruction.

---

## II. Key Contributions

- Treats virtual-camera field of view as an explicit reconstruction variable.
- Reduces the tendency to absorb perspective distortion into facial geometry.
- Integrates camera estimation with single-image 3D face recovery.

---

## III. Methodology

The supplied pipeline extracts facial evidence from the input portrait, estimates camera parameters including field of view, and uses the estimated projection when optimizing or predicting 3D face shape. This separates camera-induced appearance changes from identity-related geometry.

---

## IV. Research Focus

The method focuses on portraits captured with different camera configurations, particularly cases where wide or narrow fields of view change apparent facial proportions.
