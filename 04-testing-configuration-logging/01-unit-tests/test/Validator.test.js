const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    describe('Валидатор проверяет функциональность', () => {
      const config = {
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
        age: {
          type: 'number',
          min: 18,
          max: 27,
        },
      };

      const validator = new Validator(config);

      describe('Валидатор проверяет строковые поля', () => {
        it('В диапазоне', () => {
          const errors = validator.validate({name: 'Innokentii'});

          expect(errors).to.have.length(0);
        });

        it('Меньше минимального значения', () => {
          const data = {name: 'Yulya'};
          const errors = validator.validate(data);

          expect(errors).to.have.length(1);
          expect(errors[0]).to.have.property('field').and.to.be.equal('name');
          expect(errors[0])
              .to.have.property('error').and
              .to.be.equal(`too short, expect ${config.name.min}, got ${data.name.length}`);
        });

        it('Больше максимального значения', () => {
          const data = {name: 'DecodeNameYouTryIfYouWant'};
          const errors = validator.validate(data);

          expect(errors).to.have.length(1);
          expect(errors[0]).to.have.property('field').and.to.be.equal('name');
          expect(errors[0])
              .to.have.property('error').and
              .to.be.equal(`too long, expect ${config.name.max}, got ${data.name.length}`);
        });
      });

      describe('Валидатор проверяет числовые поля', () => {
        it('В диапазоне', () => {
          const errors = validator.validate({age: 20});

          expect(errors).to.have.length(0);
        });

        it('Меньше минимального значения', () => {
          const data = {age: 15};
          const errors = validator.validate(data);

          expect(errors).to.have.length(1);
          expect(errors[0]).to.have.property('field').and.to.be.equal('age');
          expect(errors[0])
              .to.have.property('error').and
              .to.be.equal(`too little, expect ${config.age.min}, got ${data.age}`);
        });

        it('Больше максимального значения', () => {
          const data = {age: 32};
          const errors = validator.validate(data);

          expect(errors).to.have.length(1);
          expect(errors[0]).to.have.property('field').and.to.be.equal('age');
          expect(errors[0])
              .to.have.property('error').and
              .to.be.equal(`too big, expect ${config.age.max}, got ${data.age}`);
        });
      });

      describe('Валидатор проверяет числовые и строковые поля', () => {
        it('В диапазоне', () => {
          const data = {age: 20, name: 'TamaraIvanivna'};
          const errors = validator.validate(data);

          expect(errors).to.have.length(0);
        });

        it('Должно быть по одной ошибке для каждого поля', () => {
          const data = {age: 15, name: 'TamaraPetrovaIvanonta'};
          const errors = validator.validate(data);

          expect(errors).to.have.length(2);
          expect(errors[0]).to.have.property('field').and.to.be.equal('age');
          expect(errors[0])
              .to.have.property('error').and
              .to.be.equal(`too little, expect ${config.age.min}, got ${data.age}`);
          expect(errors[1]).to.have.property('field').and.to.be.equal('name');
          expect(errors[1])
              .to.have.property('error').and
              .to.be.equal(`too long, expect ${config.name.max}, got ${data.name.length}`);
        });
      });
    });

    describe('Валидатор проверяет исключения', () => {
      it('Не передан конфиг валидации', () => {
        const validator = new Validator();

        const data = {age: 32, name: 'Valentin'};
        const errors = validator.validate(data);

        expect(errors).to.have.length(0);
      });

      it('Не передан объект для валидации', () => {
        const config = {
          name: {
            type: 'string',
            min: 5,
            max: 10,
          },
          age: {
            type: 'number',
            min: 18,
            max: 27,
          },
        };

        const validator = new Validator(config);
        const errors = validator.validate();

        expect(errors).to.have.length(0);
      });

      it('Передан объект содержащий поля, не описанные в конфиге', () => {
        const config = {
          name: {
            type: 'string',
            min: 5,
            max: 10,
          },
          age: {
            type: 'number',
            min: 18,
            max: 27,
          },
        };

        const validator = new Validator(config);

        const data = {hobby: true, age: 40};

        const errors = validator.validate(data);

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('age');
        expect(errors[0])
            .to.have.property('error').and
            .to.be.equal(`too big, expect ${config.age.max}, got ${data.age}`);
      });
    });
  });
});
