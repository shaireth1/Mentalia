import React from 'react'
import Image from "next/image";

const Panel = ({titulo, texto, imagen}) => {
    
  return (
     <div className="bg-white rounded-2xl shadow-md overflow-hidden w-1/2 hidden md:block">
            <Image
              src="/foto-panel-principal.jpg"
              alt="Bienestar"
              width={600}
              height={400}
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h2 className="text-lg font-semibold text-purple-700 mb-2">
                Tecnología al servicio de tu bienestar
              </h2>
              <p className="text-sm text-purple-500">
                Únete a nuestra comunidad y accede a herramientas personalizadas 
                para tu crecimiento emocional.
              </p>
            </div>
          </div>
  )
}

export default Panel
