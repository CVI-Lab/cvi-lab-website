import type { Alumnus, Person } from './types';

export const piBiography = [
  'Dr. Shan Du received her PhD in Electrical and Computer Engineering from the University of British Columbia. She is an Assistant Professor of Computer Science at UBC’s Okanagan campus and leads the Laboratory for Computational Vision and Intelligence.',
  'Before joining UBC, she was an Assistant Professor in the Department of Computer Science at Lakehead University and worked as a Research Scientist and Software Engineer at IntelliView Technologies Inc. She has more than 15 years of research and development experience spanning image and video processing, computer vision and graphics, pattern recognition, machine learning, biometrics, and intelligent surveillance systems.',
];

export const piResearch =
  'Her research focuses on developing innovative technologies for challenging problems in computer vision, computer graphics, machine and deep learning, image and video processing, and multimodal intelligent systems. Her work combines foundational algorithm development with real-world applications in visual analysis, sensing, environmental monitoring, and related fields.';

export const principalInvestigator: Person = {
  name: 'Dr. Shan Du',
  role: 'Assistant Professor, Computer Science · The University of British Columbia, Okanagan Campus',
  avatar: '/images/people/shan-du-avatar.png',
  email: 'shan.du@ubc.ca',
  biography: piBiography.join(' '),
};

export const phdStudents: Person[] = [
  {
    name: 'Pinjing Xu',
    role: 'PhD Student',
    avatar: '/images/people/pinjing-xu-avatar.png',
  },
  {
    name: 'Haoyu Wang',
    role: 'PhD Student',
    avatar: '/images/people/haoyu-wang-avatar.png',
  },
  {
    name: 'Ghaith Chrit',
    role: 'PhD Student',
    avatar: '/images/people/ghaith-chrit-avatar.png',
  },
];

export const mscStudents: Person[] = [
  {
    name: 'Grace Shang',
    role: 'MSc Student',
    avatar: '/images/people/grace-shang-avatar.png',
  },
  {
    name: 'Marshall Guo',
    role: 'MSc Student',
    avatar: '/images/people/marshall-guo-avatar.png',
  },
  {
    name: 'Keyi Wu',
    role: 'MSc Student',
    avatar: '/images/people/keyi-wu-avatar.png',
  },
];

export const alumni: Alumnus[] = [
  {
    name: 'Chengyu Zheng',
    formerRole: 'Postdoctoral Fellow',
    avatar: '/images/people/chengyu-zheng-avatar.png',
    currentPosition: 'Applied Scientist',
    location: 'British Columbia, Canada',
  },
  {
    name: 'Peizhi Yan',
    formerRole: 'PhD Graduate',
    avatar: '/images/people/peizhi-yan-avatar.png',
  },
  {
    name: 'Xinlong Zhao',
    formerRole: 'MSc Graduate',
    avatar: '/images/people/xinlong-zhao-avatar.png',
  },
  {
    name: 'Bill',
    formerRole: 'Undergraduate Student',
    avatar: '/images/people/bill-avatar.png',
  },
  {
    name: 'Erem Ozdemir',
    formerRole: 'Undergraduate Student',
    avatar: '/images/people/erem-ozdemir-avatar.png',
  },
];
