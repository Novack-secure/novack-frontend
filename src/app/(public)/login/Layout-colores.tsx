export default function LayoutColores() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-500 text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Header - Azul</h1>
          <p className="text-sm opacity-90">Navegación principal</p>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <aside className="w-64 bg-green-500 text-white p-4">
          <h2 className="text-xl font-semibold mb-4">Sidebar - Verde</h2>
          <nav className="space-y-2">
            <div className="bg-green-600 p-2 rounded">Menú 1</div>
            <div className="bg-green-600 p-2 rounded">Menú 2</div>
            <div className="bg-green-600 p-2 rounded">Menú 3</div>
            <div className="bg-green-600 p-2 rounded">Menú 4</div>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6">
          {/* Content Header */}
          <div className="bg-yellow-400 p-4 rounded-lg mb-6">
            <h2 className="text-xl font-bold text-gray-800">Área de Contenido Principal - Amarillo</h2>
            <p className="text-gray-700">Encabezado del contenido</p>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-purple-400 p-4 rounded-lg text-white">
              <h3 className="font-semibold mb-2">Tarjeta 1 - Morado</h3>
              <p className="text-sm opacity-90">Contenido de ejemplo</p>
            </div>
            <div className="bg-red-400 p-4 rounded-lg text-white">
              <h3 className="font-semibold mb-2">Tarjeta 2 - Rojo</h3>
              <p className="text-sm opacity-90">Contenido de ejemplo</p>
            </div>
            <div className="bg-indigo-400 p-4 rounded-lg text-white">
              <h3 className="font-semibold mb-2">Tarjeta 3 - Índigo</h3>
              <p className="text-sm opacity-90">Contenido de ejemplo</p>
            </div>
          </div>

          {/* Main Content Section */}
          <div className="bg-orange-300 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Sección Principal - Naranja</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-orange-400 p-4 rounded text-white">
                <h4 className="font-medium mb-2">Subsección A</h4>
                <p className="text-sm opacity-90">Contenido detallado aquí</p>
              </div>
              <div className="bg-orange-400 p-4 rounded text-white">
                <h4 className="font-medium mb-2">Subsección B</h4>
                <p className="text-sm opacity-90">Más contenido aquí</p>
              </div>
            </div>
          </div>

          {/* Secondary Content */}
          <div className="bg-teal-300 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Contenido Secundario - Verde Azulado</h3>
            <div className="space-y-3">
              <div className="bg-teal-400 p-3 rounded text-white">
                <p className="text-sm">Elemento secundario 1</p>
              </div>
              <div className="bg-teal-400 p-3 rounded text-white">
                <p className="text-sm">Elemento secundario 2</p>
              </div>
              <div className="bg-teal-400 p-3 rounded text-white">
                <p className="text-sm">Elemento secundario 3</p>
              </div>
            </div>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="w-64 bg-pink-500 text-white p-4">
          <h2 className="text-xl font-semibold mb-4">Sidebar Derecho - Rosa</h2>
          <div className="space-y-4">
            <div className="bg-pink-600 p-3 rounded">
              <h4 className="font-medium mb-1">Widget 1</h4>
              <p className="text-xs opacity-90">Información adicional</p>
            </div>
            <div className="bg-pink-600 p-3 rounded">
              <h4 className="font-medium mb-1">Widget 2</h4>
              <p className="text-xs opacity-90">Más información</p>
            </div>
            <div className="bg-pink-600 p-3 rounded">
              <h4 className="font-medium mb-1">Widget 3</h4>
              <p className="text-xs opacity-90">Contenido extra</p>
            </div>
          </div>
        </aside>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-700 p-3 rounded">
              <h4 className="font-semibold mb-2">Footer Sección 1 - Gris Oscuro</h4>
              <p className="text-sm opacity-80">Enlaces importantes</p>
            </div>
            <div className="bg-gray-700 p-3 rounded">
              <h4 className="font-semibold mb-2">Footer Sección 2</h4>
              <p className="text-sm opacity-80">Información de contacto</p>
            </div>
            <div className="bg-gray-700 p-3 rounded">
              <h4 className="font-semibold mb-2">Footer Sección 3</h4>
              <p className="text-sm opacity-80">Redes sociales</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
