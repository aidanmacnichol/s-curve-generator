Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # API routes
  namespace :api do
    namespace :v1 do
      resources :stepper_curves, only: [:create] do
        collection do
          post :calculate
        end
      end
    end
  end

  # Defines the root path route ("/")
  # root "articles#index"
end
