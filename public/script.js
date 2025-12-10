const { createApp } = Vue;

createApp({
    data() {
        return {
            form: {
                start_date: '',
                end_date: '',
                user_id: ''
            },
            schedules: [],
            dateHeaders: [],
            loading: false,
            errorMessage: ''
        }
    },
    methods: {
        // format tanggal header(01 Jun)
        formatDate(dateStr) {
            const date = new Date(dateStr);
            return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
        },

        generateDateHeaders(start, end) {
            let arr = [];
            let dt = new Date(start);
            let endDate = new Date(end);
            while (dt <= endDate) {
                arr.push(dt.toISOString().split('T')[0]);
                dt.setDate(dt.getDate() + 1);
            }
            this.dateHeaders = arr;
        },

        async fetchData() {
            this.loading = true;
            this.errorMessage = '';
            this.schedules = [];

            try {
                // memanggil API Back-end
                const response = await axios.get('/api/schedules', {
                    params: this.form
                });

                this.schedules = response.data.data;
                this.generateDateHeaders(this.form.start_date, this.form.end_date);

            } catch (error) {

                if (error.response && error.response.data) {
                    this.errorMessage = error.response.data.message;
                } else {
                    this.errorMessage = "Terjadi kesalahan jaringan atau server tidak merespon.";
                }
            } finally {
                this.loading = false;
            }
        },

        downloadExcel() {
            const { start_date, end_date, user_id } = this.form;
            
            if(!start_date || !end_date) {
                this.errorMessage = "Tanggal Start dan End harus diisi untuk download Excel.";
                return;
            }

            let url = `/api/export-schedules?start_date=${start_date}&end_date=${end_date}`;
            if(user_id) url += `&user_id=${user_id}`;
            
            window.location.href = url;
        }
    }
}).mount('#app');