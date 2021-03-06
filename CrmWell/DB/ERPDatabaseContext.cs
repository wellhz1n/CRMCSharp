﻿using Expoceep.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace Expoceep.DB
{
    public class ERPDatabaseContext : DbContext
    {

        public ERPDatabaseContext(DbContextOptions<ERPDatabaseContext> options) : base(options)
        {
            Tabelas.Add(typeof(Usuario).Name);
            Tabelas.Add(typeof(Produto).Name);
            Tabelas.Add(typeof(ProdutoPropriedades).Name);
            Tabelas.Add(typeof(Cliente).Name);
            Tabelas.Add(typeof(ProdutoPropriedadesEstoque).Name);
            Tabelas.Add(typeof(Venda).Name);
            Tabelas.Add(typeof(VendaProdutos).Name);


        }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            #region UsuarioKEYS
            builder.Entity<Usuario>().HasIndex(u => u.Login).IsUnique();
            builder.Entity<Usuario>().HasIndex(u => u.Cpf).IsUnique();
            #endregion
            #region ProdutoKeys
            builder.Entity<Produto>().HasIndex(u => u.Codigo).IsUnique();
            #endregion
            #region ClienteKeys
            builder.Entity<Cliente>().HasIndex(u => u.Cpf).IsUnique();
            #endregion


        }
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Produto> Produtos { get; set; }
        public DbSet<ProdutoPropriedades> ProdutosPropriedadess { get; set; }
        public DbSet<Venda> Vendas { get; set; }
        public DbSet<VendaProdutos> VendaProdutos { get; set; }
        public DbSet<Cliente> Clientes { get; set; }
        public DbSet<ProdutoPropriedadesEstoque> ProdutoPropriedadesEstoques { get; set; }
        public List<string> Tabelas = new List<string>();

  
    }

}
