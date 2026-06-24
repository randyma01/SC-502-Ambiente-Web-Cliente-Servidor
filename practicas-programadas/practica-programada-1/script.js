/*
Universidad Fidélitas
Facultad de Ingeniería
Ambiente Web Cliente/Servidor
Código del Curso: SC-502
Estudiante: Randy Martínez Sandí
Identificación: 1-1627-0570
Profesor: Javier Montoya Salazar
Grupo Virtual: 01
Campus Universitario: San Pedro
Cuatrimestre: II
23 de junio, 2026
*/

// Archivo JavaScript para Práctica Programada 1 //

$(document).ready(function () {
  // sectores
  const $sector1 = $('#sector-1')
  const $sector2 = $('#sector-2')
  const $sector3 = $('#sector-3')
  const $sector4 = $('#sector-4')
  const $meetingAlert = $('#meeting-alert')

  // ========================= //
  // sector 1: alerta en modal //
  // ========================= //
  $sector1.on('mouseenter', function () {
    alert('Esta es el sector #1')
  })

  // ======================================== //
  // sector 2: alerta en el área de la página //
  // ======================================== //
  $sector2.on('mouseenter', function () {
    $meetingAlert.removeClass('d-none').hide().fadeIn(300)
  })

  $sector2.on('mouseleave', function () {
    $meetingAlert.fadeOut(300, function () {
      $(this).addClass('d-none')
    })
  })

  // ================================= //
  // sector 3: desaparece y no regresa //
  // ================================= //
  $sector3.on('mouseenter', function () {
    $(this).fadeTo(400, 0, function () {
      $(this).css('visibility', 'hidden')
    })
  })

  // ========================================================== //
  // sector 4: cambia el fondo y elimina los bordes redondeados //
  // ========================================================== //
  $sector4.on('mouseenter', function () {
    $(this).addClass('hovered')
  })
})
