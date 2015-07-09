#pragma once

#include <string>

namespace qdb {
namespace benchmark {
namespace core {

struct test_config
{
    std::string cluster_uri;
    int content_size;
    int thread_count;
};

}}}