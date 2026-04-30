import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  cargando = false;
  registroExitoso = false;

  formulario: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formulario = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email], [this.emailRegistradoValidator]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmarPassword: ['', Validators.required],
      edad: ['', [Validators.required, this.edadMinimaValidator(18)]],
      terminos: [false, Validators.requiredTrue],
      telefonos: this.fb.array([])
    }, {
      validators: this.confirmarPasswordValidator
    });
  }

  get telefonos(): FormArray {
    return this.formulario.get('telefonos') as FormArray;
  }

  agregarTelefono() {
    this.telefonos.push(this.fb.control('', [
      Validators.required,
      Validators.minLength(10)
    ]));
  }

  eliminarTelefono(index: number) {
    this.telefonos.removeAt(index);
  }

  campoInvalido(campo: string): boolean {
    const control = this.formulario.get(campo);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  confirmarPasswordValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmar = control.get('confirmarPassword')?.value;

    return password === confirmar ? null : { passwordsNoCoinciden: true };
  }

  edadMinimaValidator(edadMinima: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const edad = Number(control.value);

      if (!edad) return null;

      return edad >= edadMinima ? null : { edadMinima: true };
    };
  }

  emailRegistradoValidator(control: AbstractControl): Promise<ValidationErrors | null> {
    const emailsRegistrados = [
      'cliente@banco.com',
      'test@correo.com',
      'admin@banco.com'
    ];

    return new Promise(resolve => {
      setTimeout(() => {
        if (emailsRegistrados.includes(control.value)) {
          resolve({ emailRegistrado: true });
        } else {
          resolve(null);
        }
      }, 1200);
    });
  }

  enviarFormulario() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.cargando = true;

    setTimeout(() => {
      console.log('Datos enviados:', this.formulario.value);

      this.cargando = false;
      this.registroExitoso = true;

      this.formulario.reset({
        nombre: '',
        email: '',
        password: '',
        confirmarPassword: '',
        edad: '',
        terminos: false
      });

      this.telefonos.clear();
    }, 2000);
  }
}