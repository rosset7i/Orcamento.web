import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { SupplierService } from 'src/app/services/supplier.service';
import { FornecedorResponse } from '../models/supplier-response';

@Component({
  selector: 'app-supplier-modal',
  templateUrl: './supplier-modal.component.html',
  styleUrls: ['./supplier-modal.component.css'],
})
export class SupplierModalComponent implements OnInit {
  form: FormGroup;

  @Input() fornecedorId: string;

  constructor(
    private formBuilder: FormBuilder,
    private fornecedorService: SupplierService,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.buscarUsuarioSeExistir();
    this.criarForm();
  }

  private mapearValores(fornecedor: FornecedorResponse) {
    this.form.controls['nome'].setValue(fornecedor.nome);
  }

  private buscarUsuarioSeExistir() {
    if (this.fornecedorId)
      this.fornecedorService
        .fetchSupplierDetails(this.fornecedorId)
        .subscribe((e: FornecedorResponse) => this.mapearValores(e));
  }

  private criarForm() {
    this.form = this.formBuilder.group({
      nome: ['', Validators.required],
    });
  }

  get canSave() {
    return this.form.valid && this.form.dirty;
  }

  save() {
    this.activeModal.close(this.form.value);
  }
}
