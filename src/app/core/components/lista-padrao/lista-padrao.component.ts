import { Component, Input, OnInit } from '@angular/core';
import { OpcoesTabela } from '../../models/opcoes-tabela';
import { PaginadoOrdenadoRequest } from '../../models/paginado-ordenado-request';
import { Direcao } from '../../utils/direction';
import { Tamanhos } from '../../utils/tamanho-pagina';

@Component({
  selector: 'app-lista-padrao',
  templateUrl: './lista-padrao.component.html',
  styleUrls: ['./lista-padrao.component.css']
})
export class ListaPadraoComponent implements OnInit {
  @Input() opcoesTabela: OpcoesTabela;

  tamanhoOpcoes = Tamanhos;
  tamanho: number = 10;
  paginalAtual: number = 1;
  direcaoOrdenacao: string = null;
  colunaOrdenacao: string = null;

  ngOnInit(): void {
    this.buscar();
    this.refreshTable();
  }

  onSort(coluna: string){
    this.colunaOrdenacao = coluna;

    if (this.direcaoOrdenacao === Direcao.ASC) {
      this.direcaoOrdenacao = Direcao.DESC;
    } else {
      this.direcaoOrdenacao = Direcao.ASC;
    }

    this.buscar();
  }

  buscar(){
    const paginadoRequest = new PaginadoOrdenadoRequest(
      this.paginalAtual,
      this.tamanho,
      this.colunaOrdenacao,
      this.direcaoOrdenacao);

    this.opcoesTabela.getCallback(paginadoRequest);
  }

  refreshTable(){
    this.opcoesTabela.refresh
      .subscribe(() => this.buscar());
  }

}