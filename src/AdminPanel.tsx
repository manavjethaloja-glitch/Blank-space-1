import { useEffect, useState } from "react";
                className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm"
              >
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="flex-1 space-y-3">
                    <div>
                      <h2 className="text-2xl font-semibold text-[#1a1a1a]">
                        {order.customerName}
                      </h2>
                      <p className="text-gray-500 text-sm">
                        Order ID: {order.id}
                      </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Phone</p>
                        <p className="font-medium">{order.phone}</p>
                      </div>

                      <div>
                        <p className="text-gray-500">Email</p>
                        <p className="font-medium">{order.email || "Not provided"}</p>
                      </div>

                      <div className="sm:col-span-2">
                        <p className="text-gray-500">Address</p>
                        <p className="font-medium">
                          {order.address}, {order.city}, {order.state} - {order.pincode}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-500">Order Total</p>
                        <p className="font-semibold text-lg text-[#1a1a1a]">
                          ₹{Math.round(order.total * 83.5)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full lg:w-[300px]">
                    <p className="text-gray-500 text-sm mb-3">
                      Payment Screenshot
                    </p>

                    {order.paymentScreenshot ? (
                      <a
                        href={order.paymentScreenshot}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          src={order.paymentScreenshot}
                          alt="Payment Screenshot"
                          className="w-full rounded-2xl border border-gray-200 hover:opacity-90 transition"
                        />
                      </a>
                    ) : (
                      <div className="bg-gray-100 rounded-2xl h-[200px] flex items-center justify-center text-gray-400 text-sm">
                        No Screenshot
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
