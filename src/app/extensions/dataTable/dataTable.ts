export function getConfigDataTable() {
  const CONFIGURACION  = {
    pagingType: 'full_numbers',
    pageLength: 10,
    lengthChange: false,
    responsive: true,
    paging: false,
    ordering: false,
    info: false,
    processing: true,
    language: {
      info: ' _START_ a _END_ de _TOTAL_ registros',
      decimal: '',
      emptyTable: 'Ningún dato disponible en esta tabla',
      infoEmpty: ' 0 a 0 d 0 registros',
      infoFiltered: '(filtrado de _MAX_ registros)',
      infoPostFix: '',
      thousands: ',',
      lengthMenu: 'Ver _MENU_ registros',
      loadingRecords: 'Cargando...',
      processing: 'Procesando...',
      search: 'Buscar:',
      zeroRecords: 'Ninguna coincidencia',
      paginate: {
        first: 'Primero',
        last: 'Último',
        next: 'Sig',
        previous: 'Ant'
      }
    }
  }

  return CONFIGURACION;
}
