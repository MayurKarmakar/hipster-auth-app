import AuthForm from "./components/auth-form";
import UserProfileView from "./components/user-profile";

function App() {
  return (
    <div className="w-full max-w-md mx-auto px-4 sm:px-6 py-4 sm:py-6">
      <AuthForm />
      <UserProfileView />
    </div>
  );
}

export default App;
