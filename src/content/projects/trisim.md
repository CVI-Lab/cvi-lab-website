---
title: TriSim
subtitle: Tri-Dimensional Similarity Modeling with Extreme Value Theory for False-Negative Mitigation in Remote Sensing Image-Text Retrieval
summary: A remote-sensing retrieval framework that models image–image, image–text, and text–text similarities to identify and reduce false-negative training signals.
publication: zheng-2026-trisim
image:
  src: /images/projects/trisim-placeholder.jpg
  alt: Illustrative placeholder showing remote-sensing imagery, a three-dimensional similarity space, and text features
  caption: Illustrative placeholder generated for this site; it is not a figure or result from the paper.
tags:
  - Remote Sensing
  - Vision–Language
  - Cross-Modal Retrieval
featured: true
featuredOrder: 3
order: 14
---

## I. Core Problem and Overall Significance

### Research Background
Remote Sensing Image-Text Retrieval (RSITR) aims to align geospatial imagery with textual descriptions in a shared embedding space, enabling bidirectional retrieval. Most modern RSITR systems rely on contrastive learning, minimizing anchor–positive distances while pushing negatives apart. However, remote sensing data are characterized by high intra-class visual/semantic similarity, scattered backgrounds, and large-scale variations, which make the negative-sample definition fragile.

### Problem Addressed
The paper targets **false negative samples (FNS)**: negative pairs that are semantically related despite being labeled as mismatched. Contrastive objectives unintentionally repel such pairs, degrading the learned semantic space.

### Why It Matters
In RS data, images of similar land-cover types, objects, or scenes frequently co-occur with semantically overlapping captions. If FNS are not handled, the model learns inconsistent representations and retrieval performance suffers. Correctly identifying and down-weighting FNS is therefore a core issue for accurate RSITR.

### Limitations of Existing Approaches
- Existing methods usually set a **threshold on cross-modal image–text similarity**; negatives with similarity above the threshold are treated as FNS and discarded or softly down-weighted.
- This single-modality-pair threshold is fragile for two reasons:
  1. **Cross-modal semantic overlap**: unrelated pairs that share partial semantics can have high image–text similarity and be wrongly discarded.
  2. **Cross-modal semantic gaps**: truly matched pairs can exhibit low image–text similarity (due to modality misalignment) and be wrongly retained as true negatives.
- The authors argue that exclusively cross-modal scoring ignores strong intra-modal correlations (image–image and text–text) that underlie elevated cross-modal similarity.

---

## II. Methodology

### Core Idea
Instead of relying on cross-modal similarity alone, _TriSim_ builds a **tri-dimensional (3D) similarity space** for each candidate negative pair:  
$$
\tau_{ij} = (s_{vt,ij}, s_{vv,ij}, s_{tt,ij})
$$

where $s_{vt}$ is normalized cross-modal image–text similarity, and $s_{vv}/s_{tt}$ are intra-modal image–image and text–text similarities. FNS are treated as **anomalies in this 3D space**, which reduces the risk of misclassification caused by cross-modal semantic overlap/misalignment.

### Key Modules and Design

#### 1. EVT-Guided Tri-Dimensional Similarity Modeling (ETSM)
Two complementary statistical filters are applied to the 3D triplets:

- **Mahalanobis Distance Filtering (A)**  
  Computes the squared Mahalanobis distance of each triplet from the multivariate mean. Since it follows a chi-squared distribution with 3 degrees of freedom, a significance-level threshold $\beta$ yields a set $\Omega_M$ of samples lying far from the dense ellipsoidal center. This captures **peripheral outliers**.

- **Extreme Value Theory Filtering (B)**  
  Selects triplets whose minimum of the three similarity components exceeds a high quantile $u$ (i.e., **upper-right high-similarity extremes**). The excesses $y = \min(\tau) - u$ are modeled with the **Generalized Pareto Distribution (GPD)** whose scale/shape parameters are estimated by maximum likelihood. The fitted CDF gives a probability $p_{ij}$ for each candidate; pairs with $p_{ij} > 1 - p_g$ form $\Omega_{\mathrm{EVT}}$.

- **Unified FNS set**  
  The final FNS set is $\Omega_{\mathrm{FN}} = \Omega_M \cap \Omega_{\mathrm{EVT}}$, combining both tail-detection strategies.

- **Probabilistic Triplet Loss**  
  For each negative pair, a discard probability is assigned: 0 for non-FNS; for FNS it is $p_d = (p_g + p_{ij} - 1) / p_g$. A Bernoulli indicator $r_{ij}$ is sampled, and the triplet loss uses $r_{ij}$ to drop or down-weight FNS. The total loss is the average of image-to-text and text-to-image triplet losses with margin $\alpha$.

#### 2. Intra-Modal Guided Discrimination Optimization (IGDO)
This module refines features of the selected FNS by amplifying discriminative regions and suppressing ambiguous ones.

- **Saliency-based mask construction**  
  For an FNS pair $(v_i, t_j)$ and the true positive image $v_j$ of $t_j$, self-attention similarities $\mathbf{a} = \operatorname{att}(v_i, v_i)$ and $\mathbf{a}' = \operatorname{att}(v_i, v_j)$ are computed. Column-summed saliency vectors $\mathbf{b}$ and $\mathbf{b}'$ identify patches that are salient in $v_i$ itself but not salient relative to $v_j$. A mask $m_{\mathrm{DSR}}$ encodes these discriminative patches.

- **Trainable gain matrix**  
  Instead of directly using the mask, a lightweight MLP maps the masked features $v_{\mathrm{gen}} = m_1 \odot v_i$ to a predicted mask $m_g$, supervised by $m_{\mathrm{DSR}}$ via L2 loss. The predicted mask guides a gain matrix $a_g$, which is added to the original self-similarity matrix: $\widetilde{a} = a + \lambda a_g$. The refined matrix is used in the final Transformer layer, with a final loss term weighted by $\gamma$.

### How the Components Work Together
- The **ETSM** identifies probable FNS in a statistically grounded way across the whole batch.
- The **probabilistic triplet loss** softly filters these FNS during contrastive optimization.
- The **IGDO** then helps the model exploit the identified FNS by directing attention to their truly discriminative, idio-syncratic features — regions that are unique to the specific image rather than generic category cues.
- Together they provide both a global sample-selection mechanism and a local feature-refinement mechanism, targeting the FNS problem from two levels.

---

## III. Experimental Design

### Datasets
- **RSICD**: 10,921 satellite images (≥224×224 pixels), each with 5 reference sentences.
- **RSITMD**: ~4,000 high-resolution image–text pairs (typically 256×256), covering diverse urban/natural scenes, also with 5 sentences per image.

### Tasks and Metrics
- Two retrieval tasks: image-to-text (I→T) and text-to-image (T→I).
- Metrics: **Recall@K** for K ∈ {1, 5, 10} for each direction, plus **mean recall (mR)** averaged over all six reported recall values.

### Baselines
Twenty-five methods are compared, grouped into:
- **General retrieval networks**: SCAN, CAMP, MTFN, SGRAF, NAAF.
- **Remote-sensing-specific methods**: SAM, LW-MCR, GaLR, IEFT, PIR, HVSA, DOVE, SWAN, CFITR.
- **CLIP-based variants**: CLIP, CLIP-Adapter, VPT, CoCoOp, MaPLE, CLGSA, RemoteCLIP, CUP, TDUF, GLISA, AIR.

### Implementation Details
- Backbone: pretrained RemoteCLIP for image/text feature extraction.
- Transformer layers $L = 2$; optimizer Adam with initial learning rate $4 \times 10^{-4}$ and decay 0.7; batch size 700.
- Two-stage hyperparameters for ETSM: first stage $q_u = 0.9$, $\beta = 0.1$, $p_g = 0.1$; second stage $u = 0.99$ quantile, $\beta = 0.01$, $p_g = 0.01$.

### Qualitative / Case Studies
- **FNS detection strategy visualization**: illustrates that Mahalanobis filtering captures peripheral outliers, EVT filtering captures upper-right extremes, and the union/intersection covers the tail more comprehensively.
- **Comparison of sampled FNS**: shows that threshold-based FNE tends to select only high cross-modal-similarity points, while _TriSim_ identifies a related pair with low cross-modal similarity as FNS (due to intra-modal cues) and rejects an unrelated pair with high cross-modal similarity as a true negative.
- **Mask visualization**: highlights regions in v_i emphasized by the learned gain mask that are not salient in the true positive v_j, confirming the intended discriminative-region effect.
- **Retrieval demos**: show top-3 image/text retrieval results; most are correct, some are semantically related but not exact matches.

---

## IV. Resources and Compute

The paper explicitly reports only that **all experiments were conducted on an NVIDIA RTX A6000 GPU**.  
The paper does not explicitly report this information: total GPU count, training time, inference cost, model parameter count, FLOPs, or memory usage.

---

## V. Experimental Coverage and Sufficiency

### Groups of Experiments
1. **Main comparison** against 25 methods on two benchmarks (RSICD and RSITMD).
2. **Quantitative visual analyses**:
   - Effects of the FNS detection strategies.
   - Comparison of sampled FNS between threshold-based filtering and _TriSim_'s 3D method.
   - Visualization of regions emphasized by the gain-matrix mask.
   - Retrieval demos.
3. **Ablation studies** on RSITMD:
   - Full model vs. no IGDO vs. no modules at all (Table 2).
   - FNS detection strategy: _CT_ (cross-modal threshold), _AT_ (3D space with quadrant-wise thresholds), and _A+B_ (proposed Mahalanobis + EVT) (Table 3).
4. **Hyperparameter evaluation** for $q_u$, $\beta$, and $p_g$, measured both before and after the final Transformer layer.

### Coverage
- **Datasets/settings**: Two public RSITR benchmarks with consistent annotations.
- **Ablations**: Present and informative; the removal of ETSM (i.e., baseline) causes a clear drop (mR 47.96 → 49.86 with only ETSM; full model 51.35).
- **Sensitivity analysis**: Provided for the three main ETSM hyperparameters.
- **Missing**: No efficiency/compute-time study, no cross-dataset generalization test, no statistical significance testing.

### Does the Evidence Support the Claims?
Yes, for the central claims that (a) 3D similarity modeling improves FNS identification over cross-modal-only thresholds, and (b) intra-modal saliency-guided refinement helps. The ablations and quantitative Table 3 directly support these points.  
However, the **main comparison fairness** cannot be fully verified from the paper alone: it is not stated whether all baselines were re-trained under identical backbones, schedules, and hyperparameters, or whether results were borrowed from prior publications.

---

## VI. Main Conclusions and Findings

### Quantitative Results
- **RSICD**: _TriSim_ achieves the highest mean recall **mR = 37.55** (e.g., GLISA: 36.99, AIR: 36.24), with the best T→I recalls: R@1 = 15.99, R@5 = 40.19, R@10 = 57.69. For I→T, it reaches R@10 = 53.26 but not the best R@1/R@5.
- **RSITMD**: _TriSim_ achieves the best **mR = 51.35**, outperforming the strongest prior method AIR (50.22) by a clear margin. It is particularly strong in text retrieval: T→I R@1 = 26.95, R@5 = 61.86, R@10 = 78.58. Image retrieval improvements are more modest (I→T R@1 and R@5 are below AIR).
- The paper reports improvements over leading methods of **1.51% on RSICD** and **2.25% on RSITMD**; these appear to be relative improvements over the best prior mR values, while the absolute mR gaps are +0.56 and +1.13 respectively.

### Ablation Findings
- Removing both proposed modules drops mR to 47.96 (RSITMD); adding only the ETSM module raises it to 49.86; the full model reaches 51.35.
- The proposed $A+B$ tail-detection strategy (51.35 mR) outperforms both a simple cross-modal threshold ($CT$: 48.54) and a 3D threshold-per-quadrant variant ($AT$: 49.16).

### Supporting Qualitative Findings
- The 3D space correctly labels a low-cross-modal-similarity pair as FNS when intra-modal relations indicate semantic relatedness, and labels a high-cross-modal-similarity pair as a true negative when intra-modal relations do not corroborate the match.
- The learned gain-matrix mask highlights image-specific discriminative regions rather than generic category-salient regions.

---

## VII. Strengths

- **Novel problem formulation**: First framework to model FNS detection in RSITR through a tri-dimensional similarity space rather than a single cross-modal score.
- **Statistical rigor**: The combination of Mahalanobis distance (chi-squared testing) and EVT/GPD tail modeling is a principled, non-arbitrary way to select extreme samples; it directly addresses the "threshold fragility" criticism.
- **Two-level mitigation**: FNS are handled both at the sample-selection/loss level (ETSM + Bernoulli probabilistic triple loss) and at the feature-refinement level (IGDO).
- **Strong empirical breadth**: 25 baselines across multiple families (general, RS-specific, CLIP-based); consistent gains in mean recall on two benchmarks.
- **Thorough ablations and hyperparameter analysis**: The design choices are individually validated, and the major hyperparameters are swept.
- **Interpretability**: Qualitative visualizations convincingly illustrate why threshold-based selection fails and how the 3D space behaves.

---

## VIII. Limitations

### Limitations Stated or Acknowledged in the Paper
- The authors note that **improvements on the image retrieval task on RSITMD are comparatively modest**; they attribute this to limited diversity in textual descriptions, which increases the likelihood of false negatives.
- The retrieval demos show that some results are incorrect, although the paper says such outputs remain highly relevant and "generally acceptable."

### Limitations Inferred from the Method and Experiments (Not Explicitly Stated by the Authors)
- **Hyperparameter sensitivity**: The method relies on several user-set thresholds ($q_u$, $\beta$, $p_g$, $u$, plus loss weights $\lambda$, $\gamma$, and boundary thresholds $\varepsilon$, $\varepsilon'$). While the paper sweeps some of them, the need for stage-specific tuning suggests sensitivity across datasets/backbones.
- **Backbone dependence**: The entire pipeline is built on a pretrained RemoteCLIP backbone; it is unclear whether the gains transfer to weaker or stronger encoders.
- **Limited generalization evidence**: Experiments cover only two mid-sized RS datasets; no large-scale datasets (e.g., RS5M), no cross-dataset transfer tests, and no noisy-correspondence scenarios are evaluated.
- **No efficiency analysis**: The addition of EVT fitting, Mahalanobis calculations, an extra Transformer layer, an MLP, and mask/gain-matrix learning may add computational overhead, but no runtime or parameter-count comparison is provided.
- **Conservative FNS selection by intersection**: Using $\Omega_M \cap \Omega_{\mathrm{EVT}}$ may miss false negatives that are only detected by one filter; the paper does not analyze precision/recall of FNS detection quantitatively.
- **Statistical significance**: No confidence intervals or significance tests are reported, so it is unclear whether small absolute mR gaps are stable across random seeds.
- **Fairness of baselines**: As noted above, the paper does not fully describe the baseline evaluation protocol (e.g., same backbone/hyperparameters), so the reader cannot fully verify fairness from the text alone.

---
