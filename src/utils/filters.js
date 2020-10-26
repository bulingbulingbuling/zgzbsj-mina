const filters = {
  questionOpts: value => {
    switch (parseInt(value)) {
      case 1:
        return 'A'
      case 2:
        return 'B'
      case 3:
        return 'C'
      case 4:
        return 'D'
      default:
        break
    }
  }
}

export default filters
