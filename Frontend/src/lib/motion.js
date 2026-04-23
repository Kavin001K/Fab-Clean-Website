export const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7 }
  }
}

export const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2
    }
  }
}
