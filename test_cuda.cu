#include <iostream>
#include <stdio.h>
#include <cuda_runtime.h>

// A simple CUDA kernel
__global__ void helloFromGPU() {
    printf("Hello from GPU!\n");
}

int main() {
    cudaDeviceSetLimit(cudaLimitPrintfFifoSize, 1024 * 1024);

    helloFromGPU<<<1, 1>>>();

    cudaError_t launchErr = cudaGetLastError();
    if (launchErr != cudaSuccess) {
        std::cerr << "Kernel launch error: " << cudaGetErrorString(launchErr) << std::endl;
        return 1;
    }

    cudaError_t syncErr = cudaDeviceSynchronize();
    if (syncErr != cudaSuccess) {
        std::cerr << "Sync error: " << cudaGetErrorString(syncErr) << std::endl;
        return 1;
    }

    std::cout << "Hello from CPU!" << std::endl;

    cudaDeviceReset();
    return 0;
}