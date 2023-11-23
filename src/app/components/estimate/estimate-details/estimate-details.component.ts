import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { DefinicaoTabela } from 'src/app/core/models/list-definition';
import { PagedAndSortedRequest } from 'src/app/core/models/paged-and-sorted-request';
import { SupplierService } from 'src/app/services/supplier.service';
import { EstimateService } from 'src/app/services/estimate.service';
import { MessageService } from 'src/app/core/services/message.service';
import { ModalDefinition } from 'src/app/core/models/modal-definition';
import { EstimateDetailsResponse } from '../models/estimate-details-response';
import { ProdutosNoOrcamentoResponse } from '../models/product-in-estimate-response';
import { FornecedorResponse } from '../../supplier/models/supplier-response';
import { PagedAndSortedSupplierRequest } from '../../supplier/models/paged-and-sorted-supplier-request';

@Component({
  selector: 'app-estimate-details',
  templateUrl: './estimate-details.component.html',
  styleUrls: ['./estimate-details.component.css'],
})
export class EstimateDetailsComponent implements OnInit {
  form: FormGroup;
  orcamentoId: string;
  selecionado: string;
  produtosNoOrcamento: ProdutosNoOrcamentoResponse[];
  fornecedores: FornecedorResponse[];
  opcoes: DefinicaoTabela;
  desativado: boolean = false;
  searchFields = ['nome'];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private fornecedorService: SupplierService,
    private orcamentoService: EstimateService
  ) {}

  ngOnInit(): void {
    this.buscarFornecedores();
    this.buscarOrcamento();
    this.criarForm();
  }

  buscarOrcamento() {
    this.orcamentoId = this.activatedRoute.snapshot.params['orcamentoId'];
    if (this.orcamentoId) {
      this.orcamentoService
        .fetchEstimateDetails(this.orcamentoId)
        .subscribe((e) => this.configurarForm(e));
    } else {
      this.produtosNoOrcamento = [];
    }
  }

  configurarForm(orcamentoDetalhes: EstimateDetailsResponse) {
    this.form.get('nome').setValue(orcamentoDetalhes.nome);
    this.form.get('fornecedorId').setValue(orcamentoDetalhes.idFornecedor);
    this.selecionado = orcamentoDetalhes.nomeFornecedor;
    this.produtosNoOrcamento = orcamentoDetalhes.produtosNoOrcamentoResponse;

    if (this.router.url.includes('visualizar')) {
      this.form.disable();
      this.desativado = true;
    }
  }

  private criarForm() {
    this.form = this.formBuilder.group({
      nome: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(75)]),
      ],
      fornecedorId: ['', Validators.required],
      produtosNoOrcamento: this.formBuilder.array([]),
    });
  }

  private buscarFornecedores() {
    const pagina = new PagedAndSortedRequest(1, 10, null, null);
    const pagina2 = new PagedAndSortedSupplierRequest(null, pagina);
    this.fornecedorService
      .fetchPagedSuppliers(pagina2)
      .subscribe((e) => (this.fornecedores = e.items));
  }

  public selecionarFornecedor(fornecedor: FornecedorResponse) {
    this.form.markAsDirty();
    this.form.get('fornecedorId').setValue(fornecedor.id);
  }

  get canSave() {
    return this.form.valid && this.form.dirty;
  }

  salvar() {
    if (this.orcamentoId) {
      this.orcamentoService
        .updateEstimate(this.orcamentoId, this.form.value)
        .subscribe(() => this.navegarParaTelaDeVisualizacao());
    } else {
      this.orcamentoService
        .createEstimate(this.form.value)
        .subscribe(() => this.navegarParaTelaDeVisualizacao());
    }
  }

  navegarParaTelaDeVisualizacao() {
    this.notificar();
    this.router.navigate(['/home/orcamentos']);
  }

  notificar() {
    this.messageService.openMessageModal(
      new ModalDefinition('Sucesso!', null, false)
    );
  }
}
