---
title: "Unequal by Design: Instance-Aware and Cluster-Differentiated Universum Construction for Multi-View Contrastive Clustering"
subtitle: Adaptive universum alignment for robust multi-view clustering
summary: AURA improves multi-view contrastive clustering by accounting for sample confidence, cluster proximity, and hubness when constructing and optimizing synthetic universum negatives.
publication: chrit-2026-aura
image:
  src: /images/projects/aura.webp
  alt: AURA framework with warm-up, hubness penalization, and cluster-sensitive universum stages
  caption: The three-stage AURA framework from the ICIP 2026 paper.
tags:
  - Multi-View Clustering
  - Contrastive Learning
  - Representation Learning
featured: false
order: 25
---

## I. Overview

Multi-view clustering combines complementary information from different views of the same unlabeled samples. Contrastive approaches can align these views effectively, but they commonly treat all positive and negative relationships in the same way. This is problematic for uncertain samples near cluster boundaries, semantically related false negatives, and high-dimensional embedding spaces dominated by a few hub points.

AURA (Adaptive Universum Representation Alignment) addresses these limitations by adapting both synthetic negative construction and contrastive optimization to the structure and confidence of the learned clusters.

---

## II. Methodology

AURA organizes training into three stages:

1. **Representation warm-up.** Per-view reconstruction and intra- and inter-view InfoNCE losses establish stable representations before pseudo-labels are introduced.
2. **Hubness penalization.** Cross-view similarities are adjusted according to how frequently each point appears as a preferred neighbor. Suppressing these hub scores produces more reliable local neighborhoods for contrastive learning.
3. **Cluster-sensitive universum alignment.** K-means pseudo-labels identify the current cluster structure. For each sample, synthetic universum negatives are formed from other-cluster centroids, with greater emphasis on nearby and therefore more confusable clusters.

The final adaptive robust contrastive objective adjusts attraction and repulsion using sample-level confidence. High-confidence samples reinforce stable cluster structure, while ambiguous samples receive more cautious treatment near decision boundaries. Additional centroid-attraction and inter-centroid repulsion terms improve cluster compactness and separation.

---

## III. Experimental Design

The method is evaluated on CUB, Scene15, and WIKI, three established multi-view benchmarks containing visual, textual, or heterogeneous feature views. Performance is measured with clustering accuracy, normalized mutual information, and adjusted Rand index over five runs.

AURA is compared with eight competitive multi-view clustering methods, including PAUSE, HCN, ROLL, CANDY, DIVIDE, SCM-RE, SURE, and MvCLN. All experiments use dual views, and the paper reports implementation with PyTorch on an NVIDIA RTX A6000 GPU.

---

## IV. Main Findings

AURA achieves the strongest average performance across the evaluated datasets and metrics. Its cluster-aware universum construction improves on approaches that place universum samples uniformly, while confidence-aware optimization handles hard positives and negatives more selectively than a single global robustness factor.

Ablation studies show that removing the warm-up stage, hubness penalization, adaptive robust contrastive loss, or centroid regularization reduces performance. Visualizations also show more compact clusters and clearer boundaries in the learned embedding space.

---

## V. Scope and Limitations

The method relies on pseudo-label quality and several stage-specific hyperparameters, and its evaluation is limited to three benchmark datasets. The paper does not provide a detailed runtime or parameter-overhead comparison. Future work could examine larger-scale multi-view datasets, stronger modality encoders, and adaptive scheduling of the training stages.

---

## VI. Publication

This work appears in the 2026 IEEE International Conference on Image Processing (ICIP). The paper is available through IEEE Xplore under DOI `10.1109/ICIP61757.2026.11630034`.
