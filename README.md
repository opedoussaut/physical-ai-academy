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

The course includes **70 in-depth lessons**, **7 progressively graded belt examinations**, **7 expanded hands-on labs**, a **74-term glossary**, an interactive two-link robot-arm kinematics exercise and technical references.


## Assessment standard — version 2.0

| Belt | Lessons | Exam questions | Minimum correct | Practical lab |
| --- | ---: | ---: | ---: | --- |
| White | 10 | 5 | 4 | System anatomy and requirements |
| Yellow | 10 | 8 | 7 | URDF and inertial validation |
| Orange | 10 | 10 | 8 | Kinematics and ROS 2 interfaces |
| Green | 10 | 12 | 10 | Perception, state estimation and control |
| Blue | 10 | 15 | 12 | Simulation and policy evaluation |
| Brown | 10 | 18 | 15 | Deployment architecture and safety case |
| Black | 10 | 20 | 17 | End-to-end validated Physical AI system |

Each lesson has engineering explanations, a worked example, a common misconception, an exercise, primary-source pointers and a knowledge check. The examination includes increasingly difficult applied questions. Practical work is self-assessed and should be recorded outside the site if you want a portfolio of evidence; the academy itself does not inspect uploaded homework or issue formal certifications.

## Progress and assessments

To earn a belt, pass the ten lesson knowledge checks, pass the progressive examination (5/8/10/12/15/18/20 questions by belt, at least 80% correct or 85% for Black), and complete every practical-lab checkpoint before self-declaring the deliverable complete. Practical completion is self-attested; these belts are not an external robotics qualification.

The v2 upgrade preserves previous lesson-check progress but resets earlier five-question exam passes and previously declared labs, because the new requirements are stricter. Progress is saved **locally in your browser** using localStorage. Use the academy's **Progress & data** section to export or import a progress JSON file when changing devices or browsers. There is no login or server-side account.

## Hosting and maintenance

- Main site: https://physical-ai-academy.vercel.app/
- Source repository: https://github.com/opedoussaut/physical-ai-academy
- The application shell and initial curriculum are in `index.html`. Version 2 extensions are in `curriculum/upgrade-core.js`, seven belt-specific source files, and `curriculum/finish.js`, loaded synchronously before the application starts.
- Vercel production deploys from the `main` branch. No runtime API keys, paid AI service or backend are required.
- The academy uses **vendor-neutral learning objectives and scenarios**. External tools in readings (ROS 2, MoveIt, MuJoCo, Isaac Lab, LeRobot) are examples and official references, not commercial endorsements.
- Published curriculum is for education; check the original documentation when an API, model or standard changes.

To run locally, open `index.html` in a modern browser or serve the repository with:

```bash
python -m http.server 8000
```

Then visit http://localhost:8000/.

## Scope

A learning website, not a robotics control system. Its interactive kinematics example is educational and does not constitute a full robot simulator or hardware safety system.
