<template>
  <div class="receipt p-4" id="receipt">
    <!-- Store Information -->
    <div class="text-center mb-3">
      <h3>{{ storeInfo.name }}</h3>
      <div>{{ storeInfo.address }}</div>
      <div>Tel: {{ storeInfo.phone }}</div>
    </div>

    <!-- Transaction Header -->
    <div class="mb-2">
      <div><strong>No. Transaksi:</strong> {{ faktur }}</div>
      <div><strong>Tanggal:</strong> {{ header.tanggal }}</div>
      <div><strong>Kasir:</strong> {{ header.kasir }}</div>
    </div>
    
    <!-- Item Details -->
    <table class="table table-borderless">
      <thead>
        <tr>
          <th>Nama</th>
          <th>Unit</th>
          <th class="text-end">Qty</th>
          <th class="text-end">Harga</th>
          <th class="text-end">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, i) in detail" :key="i">
          <td>{{ item.name }}</td>
          <td>{{ item.unit_name }}</td>
          <td class="text-end">{{ item.qty }}</td>
          <td class="text-end">{{ formatCurrency(item.price) }}</td>
          <td class="text-end">{{ formatCurrency(item.subtotal) }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Summary -->
    <div class="mt-3">
      <div><strong>Total:</strong> {{ formatCurrency(header.total) }}</div>
      <div><strong>Bayar:</strong> {{ formatCurrency(header.bayar) }}</div>
      <div><strong>Kembali:</strong> {{ formatCurrency(header.bayar - header.total) }}</div>
    </div>

    <!-- Footer -->
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
    const { bayar = 0, kembali = 0 } = route.query;

    const detail = ref([]);
    const header = ref({ tanggal: '', total: 0, kasir: '', bayar: Number(bayar) });

    // Store info (can be loaded/edited later)
    const storeInfo = ref({
      name: 'Nama Toko',
      address: 'Alamat Toko',
      phone: '081234567890'
    });

    onMounted(async () => {
      detail.value = await window.api.getTransactionDetail(faktur);
      const all = await window.api.fetchTransactions();
      const h = all.find(t => t.faktur === faktur) || {};
      header.value = {
        tanggal: h.tanggal,
        total: h.total,
        kasir: h.kasir,
        bayar: Number(bayar)
      };
      window.print();
    });

    const formatCurrency = v =>
      new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v);

    return { storeInfo, faktur, detail, header, formatCurrency };
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
