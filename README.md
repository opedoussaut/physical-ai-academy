# Physical AI Academy

A **vendor-neutral, self-paced robotics and Physical AI academy**, organized around seven judo-inspired belt levels.

**Open the academy:** https://physical-ai-academy.vercel.app/

## Learning journey

| Belt | Focus |
| --- | --- |
| White | Robotics fundamentals |
| Yellow | Robot anatomy, URDF and physical models |
| Orange | Kinematics, motion and ROS 2 |
| Green | Perception, control and planning |
| Blue | Simulation and robot learning |
| Brown | Physical AI systems and deployment |
| Black | End-to-end Physical AI engineering |

The course includes **28 lessons**, **7 belt examinations**, **7 hands-on labs**, a **47-term glossary**, a robot-arm kinematics exercise and technical references.

## Progress and assessments

To earn a belt, complete all four lesson knowledge checks, pass the five-question examination with at least 80%, and mark the associated hands-on lab complete. Practical completion is self-attested; these belts are not an external robotics qualification.

Progress is saved **locally in your browser** using localStorage. Use the academy's **Progress & data** section to export or import a progress JSON file when changing devices or browsers. There is no login or server-side account.

## Hosting and maintenance

- Main site: https://physical-ai-academy.vercel.app/
- Source repository: https://github.com/opedoussaut/physical-ai-academy
- The static application is in `index.html`, with all CSS, data and JavaScript inlined.
- Vercel production deploys from the `main` branch. No runtime API keys, paid AI service or backend are required.
- The academy contains **no Dassault Systèmes, GEN7 or brand-specific internal training content**. External tools mentioned in lessons are examples, not endorsements.
- Published curriculum is for education; check the original documentation when an API, model or standard changes.

To run locally, open `index.html` in a modern browser or serve the repository with:

```bash
python -m http.server 8000
```

Then visit http://localhost:8000/.

## Scope

A learning website, not a robotics control system. Its interactive kinematics example is educational and does not constitute a full robot simulator or hardware safety system.
