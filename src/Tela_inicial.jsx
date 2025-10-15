import User_login from "./components/views/User_login";

function Tela_inicial() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-black">
      {/* Header */}
      <header className="flex items-center gap-4 mt-8">
        <img
          src="/src/assets/react.svg"
          alt="React logo"
          className="h-12 w-12"
        />
        <h1 className="text-3xl font-semibold text-blue-500">React Music</h1>
      </header>

      {/* Separator */}
      <div className="w-full max-w-xl h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent my-8" />

      {/* Main Content */}
      <main className="flex justify-center w-full">
        <User_login />
      </main>
    </div>
  );
}

export default Tela_inicial;
