module.exports = class Validator {
  constructor(rules) {
    this.rules = rules;
  }

  validate(obj) {
    if (!this.rules || !obj) return [];

    const errors = [];

    for (const field of Object.keys(obj)) {
      if (!(field in this.rules)) continue;

      const rules = this.rules[field];

      const value = obj[field];
      const type = typeof value;

      if (type !== rules.type) {
        errors.push({field, error: `expect ${rules.type}, got ${type}`});
        return errors;
      }

      switch (type) {
        case 'string':
          if (value.length < rules.min) {
            errors.push({field, error: `too short, expect ${rules.min}, got ${value.length}`});
          } else if (value.length > rules.max) {
            errors.push({field, error: `too long, expect ${rules.max}, got ${value.length}`});
          }
          break;
        case 'number':
          if (value < rules.min) {
            errors.push({field, error: `too little, expect ${rules.min}, got ${value}`});
          } else if (value > rules.max) {
            errors.push({field, error: `too big, expect ${rules.max}, got ${value}`});
          }
          break;
      }
    }

    return errors;
  }
};
