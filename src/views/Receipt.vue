<template>
    <div class="receipt p-4" id="receipt">
      <h3 class="text-center mb-3">Mini Kasir</h3>
      <div class="mb-2">
        <div><strong>Nomor:</strong> {{ faktur }}</div>
        <div><strong>Tanggal:</strong> {{ header.tanggal }}</div>
        <div><strong>Kasir:</strong> {{ header.kasir }}</div>
      </div>
      <table class="table table-borderless">
        <thead>
          <tr>
            <th>#</th>
            <th>Nama</th>
            <th>Unit</th>
            <th class="text-end">Qty</th>
            <th class="text-end">Harga</th>
            <th class="text-end">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in detail" :key="i">
            <td>{{ i+1 }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.unit_name }}</td>
            <td class="text-end">{{ item.qty }}</td>
            <td class="text-end">{{ formatCurrency(item.price) }}</td>
            <td class="text-end">{{ formatCurrency(item.subtotal) }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="5" class="text-end"><strong>Total</strong></td>
            <td class="text-end"><strong>{{ formatCurrency(header.total) }}</strong></td>
          </tr>
        </tfoot>
      </table>
      <div class="text-center mt-4">*** Terima Kasih ***</div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  
  export default {
    name: 'Receipt',
    setup() {
      const route = useRoute();
      const faktur = route.params.faktur;
      const detail = ref([]);
      const header = ref({ tanggal: '', total: 0, kasir: '' });
  
      // fetch detail items
      onMounted(async () => {
        detail.value = await window.api.getTransactionDetail(faktur);
        // fetch header via fetchTransactions and filter
        const all = await window.api.fetchTransactions();
        const h = all.find(t => t.faktur === faktur) || {};
        header.value = { tanggal: h.tanggal, total: h.total, kasir: h.kasir };
        // trigger print dialog after render
        window.print();
      });
  
      const formatCurrency = v =>
        new Intl.NumberFormat('id-ID', { style:'currency', currency:'IDR', minimumFractionDigits:0, maximumFractionDigits:0 }).format(v);
  
      return { faktur, detail, header, formatCurrency };
    }
  };
  </script>
  
  <style scoped>
  .receipt {
    width: 350px;
    font-family: monospace;
    font-size: 12pt;
  }
  .table-borderless th,
  .table-borderless td {
    padding: 2px 4px;
  }
  </style>
  